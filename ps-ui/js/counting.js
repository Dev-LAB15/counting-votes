/**
 * This file is part of Counting Votes project.
 * 
 * Counting Votes project is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or any later version.
 * 
 * Counting Votes project is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with Counting Votes project. If not, see <http://www.gnu.org/licenses/>.
 */
window.addEventListener('load', function () {
    if (!this.window.localStorage.token) {
        this.window.location = 'index.html';
        return;
    }
    vm = new Vue({
        i18n,
        el: '#app',
        data: {
            chairman: this.window.localStorage.chairman,
            tellers: getTellers(),
            log: []
        },
        mounted: function () {
            $('#app').fadeIn();
        },
        methods: {
            registerVote: function (voteId) {

                var vote = { option: voteId };
                axios.post(apiEndpoint + '/counting/vote', vote, axiosHeaders)
                    .then(resp => {
                        var msg = vm.$t('message.voteRecorded');
                        if (resp.data.message)
                            msg = resp.data.message;
                        this.$toasted.show(msg, {
                            theme: "outline",
                            position: "bottom-center",
                            duration: 3000
                        });
                    }).catch(error => {
                        var msg = error.message;
                        if (error && error.response && error.response.data && error.response.data.message) {
                            msg += error.response.data.message;
                        }
                        this.$toasted.show(msg, {
                            theme: "bubble",
                            position: "bottom-center",
                            duration: 3000
                        });
                    });
            },
            validateIfCanFinish: function () {
                axios.get(apiEndpoint + '/counting/canfinish', axiosHeaders)
                    .then(resp => {
                        window.location = 'counting-verify.html';
                    }).catch(error => {
                        this.$toasted.show('Please wait all the counting is confirmed', {
                            theme: "bubble",
                            position: "bottom-center",
                            duration: 3000
                        });
                    });
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