setTimeout(() => {
    (function($){$(document).ready(function () {
        /******************************************/
        let timer = null;

        const iframe1 = document.createElement('iframe');
        iframe1.src = `/preview/`;
        $('.field-text_en > div').append(iframe1);

        const iframe2 = document.createElement('iframe');
        iframe2.src = `/preview/`;
        $('.field-text_ru > div').append(iframe2);

        onTextareaChange.bind(this)(iframe1, $('.field-text_en textarea'));
        onTextareaChange.bind(this)(iframe2, $('.field-text_ru textarea'));

        function onTextareaChange(iframe, el) {
            if (timer !== null) {
                clearTimeout(timer);
                timer = null;
            }
            timer = setTimeout(() => {
                $.ajax({
                    url: `/preview/`,
                    method: 'POST',
                    data: {text: el.val()},
                    success: (data) => {
                        $('body', $(iframe).contents()).html(data);
                    }
                })
            }, 500);
        }

        $('.field-text_en textarea').on('input', () => onTextareaChange.bind(this)(iframe1, $('.field-text_en textarea')));
        $('.field-text_ru textarea').on('input', () => onTextareaChange.bind(this)(iframe2, $('.field-text_ru textarea')));

        /******************************************/
    })})(django.jQuery);
}, 500)


