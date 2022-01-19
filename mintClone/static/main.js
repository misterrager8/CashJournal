$(document).ready(function() {
//    localStorage.setItem('mintClone-theme', 'default');
    var currentTheme = localStorage.getItem('mintClone-theme');
});

function toggleDiv(divId) {
    $('#' + divId).toggle();
}

function refreshDiv(divId) {
    $('#' + divId).load(location.href + ' #' + divId);
}

function accountCreate() {
    $.post('account_create', {
        name: $('#name').val(),
        balance: $('#balance').val(),
        type: $('#type_').val()
    }, function(data) {
        refreshDiv('accounts');
    });
}

function accountDelete(accountId) {
    $.get('account_delete', {
        id_: accountId
    }, function(data) {
        refreshDiv('accounts');
    });
}

function txnCreate(accountId) {
    $.post('txn_create', {
        id_: accountId,
        recipient: $('#recipient').val(),
        amount: $('#amount').val(),
        description: $('#description').val(),
        timestamp: $('#timestamp').val()
    }, function(data) {
        refreshDiv('txns');
    });
}

function txnDelete(txnId) {
    $.get('txn_delete', {
        id_: txnId
    }, function(data) {
        refreshDiv('txns');
    });
}