setTimeout(() => {
    (function($){$(document).ready(function () {
        /******************************************/
        let timer = null;

        window.iframe1 = document.createElement('iframe');
        window.iframe1.src = `/preview/`;
        $('.field-text_en > div').append(window.iframe1);

        window.iframe2 = document.createElement('iframe');
        window.iframe2.src = `/preview/`;
        $('.field-text_ru > div').append(window.iframe2);

        onTextareaChange.bind(this)(window.iframe1, $('.field-text_en textarea'));
        onTextareaChange.bind(this)(window.iframe2, $('.field-text_ru textarea'));

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

        $('textarea').each(function(i, el){
            new Behave({textarea: el});
        });

        BehaveHooks.add('keydown', function() {
            onTextareaChange.bind(this)(window.iframe1, $('.field-text_en textarea'));
            onTextareaChange.bind(this)(window.iframe2, $('.field-text_ru textarea'));
        });

        $('#id_text_ru').on('click', function () {
            var iframeDocument = window.iframe2.contentWindow.document;
            var start = this.selectionStart;
            var end   = this.selectionEnd;
            var selectedText = this.value.substring(start, end);
            selectedText = selectedText.replace(/#/g, "").trim();
            if (selectedText === '') return ;
            for (const link of Array.from(iframeDocument.querySelectorAll('.toc a'))) {
                if (link.innerText.includes(selectedText)) {
                    link.click()
                }
            }
        });

        /******************************************/
    })})(django.jQuery);
}, 500)


