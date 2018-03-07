var vm;

window.addEventListener('load', function () {
    vm = new Vue({
        i18n,
        el: '#app',
        data: {
            chairman: this.window.localStorage.chairman,
            tellers: getTellers()
        },
        methods: {
            registerVote: function (voteId) {

                var vote = { option: voteId };
                axios.post(apiEndpoint + '/counting/vote', vote, axiosHeaders)
                    .then(resp => {

                    }
                    ).catch(error => {

                    }
                    );


                console.log('vote id reached vue vm: ' + voteId);
            }
        }
    });

    (function () {
        var body = document.body,
            dropArea = document.getElementById('drop-area'),
            droppableArr = [], dropAreaTimeout;

        // initialize draggable(s)
        [].slice.call(document.querySelectorAll('#grid .grid__item')).forEach(function (el) {
            new Draggable(el, droppableArr, {
                draggabilly: { containment: document.body },
                onStart: function () {
                    // add class 'drag-active' to body
                    classie.add(body, 'drag-active');
                    // clear timeout: dropAreaTimeout (toggle drop area)
                    clearTimeout(dropAreaTimeout);
                    // show dropArea
                    classie.add(dropArea, 'show');
                },
                onEnd: function (wasDropped) {
                    var afterDropFn = function () {
                        // hide dropArea
                        classie.remove(dropArea, 'show');
                        // remove class 'drag-active' from body
                        classie.remove(body, 'drag-active');
                    };

                    if (!wasDropped) {
                        afterDropFn();
                    }
                    else {
                        // after some time hide drop area and remove class 'drag-active' from body
                        clearTimeout(dropAreaTimeout);
                        dropAreaTimeout = setTimeout(afterDropFn, 400);
                    }
                }
            });
        });

        // initialize droppables
        [].slice.call(document.querySelectorAll('#drop-area .drop-area__item')).forEach(function (el) {
            droppableArr.push(new Droppable(el, {
                onDrop: function (instance, draggableEl) {
                    // show checkmark inside the droppabe element
                    classie.add(instance.el, 'drop-feedback');
                    clearTimeout(instance.checkmarkTimeout);
                    instance.checkmarkTimeout = setTimeout(function () {
                        classie.remove(instance.el, 'drop-feedback');
                        draggableEl.style.left = '50%';
                        draggableEl.style.top = '50%';
                        vm.registerVote(instance.el.id);
                    }, 600);
                    // ...
                }
            }));
        });
    })();
});