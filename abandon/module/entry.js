import 'abandon/css/layout.scss';
import 'static/plugin/modal/modal.scss';
import 'static/plugin/modal/modal.js';
import 'static/plugin/input/input.scss';
import 'abandon/css/module.scss';
import mde from 'static/db/module';



import application from 'app/static/application';
import { moduleUpdata } from 'static/utils/dom';


function initSelectOption(data) {
    $(() => {
        let selectOption = '<option value="">root</option>';
        data.forEach(item => {
            selectOption += `<option value="${item['id']}">${item['title']}</option>`;
        });
        $('#parent').html(selectOption);
    });
}

application.init().then(resource => {
    initSelectOption(resource['module']);
});




$(() => {
    $('#checkall').click(() => {
        if ($('#checkall').prop('checked')) {
            $('tbody input[type="checkbox"]').prop('checked', true);
        } else {
            $('tbody input[type="checkbox"]').prop('checked', false);
        }
    });

    $('.s-table').on('click', 'input[type="checkbox"]', () => {
        if ($('tbody input[type="checkbox"]:checked').length !== 1) {
            $('#edit-module').prop('disabled', true);
        } else {
            $('#edit-module').prop('disabled', false);
        }
    });

    $('#add-module').click(() => {
        $('#title').val('');
        $('#id').val('');
        $('#parent').val('');
        $('#key').val('');
        $('#order').val('');
        $('#link').val('');
        $('#remark').val('');
        $.modal('.s-modal');
    });

    $('#edit-module').click(() => {
        let t = $('tbody input[type="checkbox"]:checked').parents('tr').children('td');
        $('#title').val(t.eq(1).text());
        $('#id').val(t.eq(1).prop('id'));
        $('#parent').val(t.eq(2).prop('id'));
        $('#key').val(t.eq(3).text());
        $('#order').val(t.eq(4).text());
        $('#link').val(t.eq(5).text());
        $('#remark').val(t.eq(6).text());
        $.modal('.s-modal');
    });

    $('#modal-save').click(() => {
        const n = new mde();
        n.id = $('#id').val().trim();
        n.title = $('#title').val().trim();
        n.key = $('#key').val().trim();
        n.parentModuleId = $('#parent').val();
        n.link = $('#link').val().trim();
        n.remark = $('#remark').val().trim();
        n.order = $('#order').val().trim();
        n.edit().then(res => {
            if (res['statusKey'] === 666) {
                application.updateView({ module: res['data'] });
                initSelectOption(res['data']);
                $('#editModule').prop('disabled', true);

            } else {
                throw new Error(res['message']);
            }
        });
    });

    $('#delete-module').click(() => {
        for (let i = 0; i < $('tbody input[type="checkbox"]:checked').length; i++) {
            const n = new mde($('tbody input[type="checkbox"]:checked').eq(i).parents('tr').children().eq(1).prop('id'));
            n.delete().then(res => {
                if (res['statusKey'] === 666) {
                    application.updateView({ module: res['data'] });
                    initSelectOption(res['data']);
                }
            });
        }
    });

});