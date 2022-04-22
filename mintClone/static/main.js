function toggleDiv(divId) {
    $('#' + divId).fadeToggle(150);
}

function refreshDiv() {
    $('#content').load(location.href + ' #content');
}

function accountCreate() {
    $('#spinner').show();
    $.post('account_create', {
        name: $('#name').val(),
        balance: $('#balance').val(),
        type: $('#type_').val()
    }, function(data) {
        refreshDiv();
    });
}

function accountUpdate(accountId) {
    $('#spinner').show();
    $.post('account_update', {
        id_: accountId,
        name: $('#name').val(),
        balance: $('#balance').val(),
        type: $('#type_').val()
    }, function(data) {
        refreshDiv();
    });
}

function accountDelete(accountId) {
    $('#spinner').show();
    $.get('account_delete', {
        id_: accountId
    }, function(data) {
        refreshDiv();
    });
}

function txnCreate(accountId) {
    $('#spinner').show();
    $.post('txn_create', {
        id_: accountId,
        txn_type: $('input[name="txn_type"]:checked').val(),
        recipient: $('#recipient').val(),
        amount: $('#amount').val(),
        description: $('#description').val(),
        timestamp: $('#timestamp').val()
    }, function(data) {
        refreshDiv();
    });
}

function txnDelete(txnId) {
    $('#spinner').show();
    $.get('txn_delete', {
        id_: txnId
    }, function(data) {
        refreshDiv();
    });
}