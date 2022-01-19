$(document).ready(function() {
//    localStorage.setItem('mintClone-theme', 'default');
    var currentTheme = localStorage.getItem('mintClone-theme');
});

function toggleDiv(divId) {
    $('#' + divId).toggle();
}

function refreshDiv() {
    $('#content').load(location.href + ' #content');
}

function accountCreate() {
    $.post('account_create', {
        name: $('#name').val(),
        balance: $('#balance').val(),
        type: $('#type_').val()
    }, function(data) {
        refreshDiv();
    });
}

function accountUpdate(accountId) {
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
    $.get('account_delete', {
        id_: accountId
    }, function(data) {
        refreshDiv();
    });
}

function txnCreate(accountId) {
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
    $.get('txn_delete', {
        id_: txnId
    }, function(data) {
        refreshDiv();
    });
}