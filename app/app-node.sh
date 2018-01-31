#!/usr/bin/env bash

app_install_node()
{
    process_node_args "$@"

    if [[ "$SKIP_DEPS" != "Y" ]]; then
        heading "Checking Dependencies..."
        check_program_dependencies "${DEPENDENCIES_PROGRAMS[@]}"
        check_nodejs_dependencies "${DEPENDENCIES_NODEJS[@]}"
    fi

    app_uninstall_node "$@"

    heading "Installing Node to $SIDECHAIN_PATH..."

    PREFIX=$(sh -c "jq '.$PREFIX' $__dir/prefixes.json")
    if [[ -z "$PREFIX" ]]; then
        PREFIX=$(sh -c "jq '.M' $__dir/prefixes.json")
    fi

    DB=$(sudo -u postgres psql -t -c "\l $DATABASE_NAME" | awk '{$1=$1};1' | awk '{print $1}')
    if [[ "$DB" == "$DATABASE_NAME" ]]; then
        read -p "Database $DATABASE_NAME already exists. Recreate? [y/N]: " choice
        if [[ "$choice" =~ ^(yes|y) ]]; then
            dropdb "$DATABASE_NAME"
        else
            abort 1 "Database $DATABASE_NAME already exists."
        fi
    fi
    PQ_USER=$(sudo -u postgres psql -t -c "SELECT usename FROM pg_catalog.pg_user WHERE usename = '$USER'" | awk '{$1=$1};1')
    if [[ "$PQ_USER" == "$USER" ]]; then
        read -p "User $USER already exists. Recreate? [y/N]: " choice
        if [[ "$choice" =~ ^(yes|y) ]]; then
            sudo -u postgres psql -c "DROP USER $USER"
            sudo -u postgres psql -c "CREATE USER $USER WITH PASSWORD 'password' CREATEDB;"
        else
            echo "Skipping User Creation for $USER"
        fi
    else
        sudo -u postgres psql -c "CREATE USER $USER WITH PASSWORD 'password' CREATEDB;"
    fi

    createdb "$DATABASE_NAME"

    rm -rf "$SIDECHAIN_PATH"
    git clone https://github.com/ArkEcosystem/ark-node.git -b explorer "$SIDECHAIN_PATH"
    cd "$SIDECHAIN_PATH"

    npm install libpq
    npm install secp256k1
    npm install bindings
    npm install

    local YEAR=$(date +"%-Y")
    local MONTH=$(expr $(date +"%-m") - 1)
    local DAY=$(date +"%-d")
    local HOUR=$(date +"%-H")
    local MINUTE=$(date +"%-M")
    local SECOND=$(date +"%-S")
    local FORGERS_OFFSET=$(expr $FORGERS + 1)

    mv "$SIDECHAIN_PATH/networks.json" "$SIDECHAIN_PATH/networks.json.orig"
    jq ".$CHAIN_NAME = {\"messagePrefix\": \"$CHAIN_NAME message:\\n\", \"bip32\": {\"public\": 70617039, \"private\": 70615956}, \"pubKeyHash\": $PREFIX, \"wif\": 187, \"client\": {\"token\": \"$TOKEN\", \"symbol\": \"$SYMBOL\", \"explorer\": \"http://$NODE_IP\"}}" "$SIDECHAIN_PATH/networks.json.orig" > "$SIDECHAIN_PATH/networks.json"
    cd "$SIDECHAIN_PATH/tasks"
    rm -rf demo
    mkdir demo
    sed -i -e "s/bitcoin/$CHAIN_NAME/g" createGenesisBlock.js
    sed -i -e "s/var db_name = \"ark_\" + network_name;/var db_name = \"$DATABASE_NAME\";/g" createGenesisBlock.js
    sed -i -e "s/for(var i=1; i<52; i++){/for(var i=1; i<$FORGERS_OFFSET; i++){/g" createGenesisBlock.js
    sed -i -e "s/for(var i=0;i<51;i++){/for(var i=0;i<$FORGERS;i++){/g" createGenesisBlock.js
    sed -i -e "s/var totalpremine = 2100000000000000;/var totalpremine = $TOTAL_PREMINE;/g" createGenesisBlock.js
    sed -i -e "s/send: 10000000/send: $FEE_SEND/g" "$SIDECHAIN_PATH/helpers/constants.js"
    sed -i -e "s/vote: 100000000/vote: $FEE_VOTE/g" "$SIDECHAIN_PATH/helpers/constants.js"
    sed -i -e "s/secondsignature: 500000000/secondsignature: $FEE_SECOND_PASSPHRASE/g" "$SIDECHAIN_PATH/helpers/constants.js"
    sed -i -e "s/delegate: 2500000000/delegate: $FEE_DELEGATE/g" "$SIDECHAIN_PATH/helpers/constants.js"
    sed -i -e "s/multisignature: 500000000/multisignature: $FEE_MULTISIG/g" "$SIDECHAIN_PATH/helpers/constants.js"
    sed -i -e "s/activeDelegates: 51/activeDelegates: $FORGERS/g" "$SIDECHAIN_PATH/helpers/constants.js"
    sed -i -e "s/maximumVotes: 1/maximumVotes: $MAX_VOTES/g" "$SIDECHAIN_PATH/helpers/constants.js"
    sed -i -e "s/blocktime: 8/blocktime: $BLOCK_TIME/g" "$SIDECHAIN_PATH/helpers/constants.js"
    sed -i -e "s/maxTxsPerBlock: 50/maxTxsPerBlock: $TXS_PER_BLOCK/g" "$SIDECHAIN_PATH/helpers/constants.js"
    sed -i -e "s/offset: 75600/offset: $REWARD_HEIGHT_START/g" "$SIDECHAIN_PATH/helpers/constants.js"
    sed -i -e "s/200000000, \/\//$REWARD_PER_BLOCK, \/\//g" "$SIDECHAIN_PATH/helpers/constants.js"
    sed -i -e "s/200000000 \/\//$REWARD_PER_BLOCK \/\//g" "$SIDECHAIN_PATH/helpers/constants.js"
    if [[ "$UPDATE_EPOCH" == "Y" ]]; then
        sed -i -e "s/epochTime: new Date(Date.UTC(2017, 2, 21, 13, 0, 0, 0))/epochTime: new Date(Date.UTC($YEAR, $MONTH, $DAY, $HOUR, $MINUTE, $SECOND, 0))/g" "$SIDECHAIN_PATH/helpers/constants.js"
    fi
    node createGenesisBlock.js
    cp "$SIDECHAIN_PATH/tasks/demo/config.$CHAIN_NAME.autoforging.json" "$SIDECHAIN_PATH"
    cp "$SIDECHAIN_PATH/tasks/demo/config.$CHAIN_NAME.json" "$SIDECHAIN_PATH"
    cp "$SIDECHAIN_PATH/tasks/demo/genesisBlock.$CHAIN_NAME.json" "$SIDECHAIN_PATH"

    local PASSPHRASE=$(sh -c "jq '.passphrase' $SIDECHAIN_PATH/tasks/demo/genesisPassphrase.$CHAIN_NAME.json")
    local ADDRESS=$(sh -c "jq '.address' $SIDECHAIN_PATH/tasks/demo/genesisPassphrase.$CHAIN_NAME.json")

    echo "Your Genesis Details are:"
    echo "  Passphrase: $PASSPHRASE"
    echo "  Address: $ADDRESS"

    success "Sidechain Installed!"
}

app_uninstall_node()
{
    heading "Uninstalling..."

    process_node_args "$@"

    DB=$(sudo -u postgres psql -t -c "\l $DATABASE_NAME" | awk '{$1=$1};1' | awk '{print $1}')
    if [[ "$DB" == "$DATABASE_NAME" ]]; then
        dropdb "$DATABASE_NAME"
    fi
    rm -rf "$SIDECHAIN_PATH"

    success "Uninstall OK!"
}
