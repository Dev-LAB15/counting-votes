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
window.addEventListener("load", function() {
  Vue.use(VueQrcodeReader);

  // if (!this.window.localStorage.token) {
  //     this.window.location = 'index.html';
  //     return;
  // }

  function fetchTransactions() {
    axios.get(apiEndpoint + "/transaction/list", axiosHeaders).then(res => {
      vm.transactions = [];
      for (var i = 0; i < res.data.length; i++) {
        vm.transactions.push(res.data[i]);
      }
    });
  }

  let tellers = getTellers();
  var vm = new Vue({
    i18n,
    el: "#app",
    data: {
      paused: false,
      powerOfAttorney: false,
      transactions: [],
      chairman: this.window.localStorage.chairman,
      tellers: getTellers(),
      model: {
        qrcode: ""
      }
    },
    mounted: function() {
      $("#app").fadeIn();
      setInterval(fetchTransactions, 15000);
    },
    methods: {
      onDecode(content) {
        $("#confirm-qrcode-modal")
          .modal()
          .one("click", "#button-yes", function(e) {
            var postAction;
            if (window.powerOfAttorney) {
              postAction = "/scan/powerofattorney";
            } else {
              postAction = "/scan/qrcode";
            }
            var _model = {
              code: content
            };
            axios
              .post(apiEndpoint + postAction, _model, axiosHeaders)
              .then(resp => {
                vm.$toasted.show(vm.$t("message.scanSuccessfull"), {
                  theme: "outline",
                  position: "bottom-center",
                  duration: 3000
                });
                //must hide the cancellation form
                window.powerOfAttorney = false;
                $("#private-power-of-attorney-cancellation").hide();
              })
              .catch(error => {
                //must hide the cancellation form
                if (
                  error &&
                  error.response &&
                  error.response.data &&
                  error.response.data.message
                ) {
                  vm.$toasted.show(error.response.data.message, {
                    theme: "bubble",
                    position: "bottom-center",
                    duration: 3000
                  });
                }
                window.powerOfAttorney = false;
                $("#private-power-of-attorney-cancellation").hide();
              });
          });
      },
      onLocate(points) {},
      manualInput: function() {
        axios
          .post(apiEndpoint + "/scan/qrcode", vm.model, axiosHeaders)
          .then(resp => {
            vm.$toasted.show(this.$t("message.qrCodeScannedSuccessfully"), {
              theme: "outline",
              position: "bottom-center",
              duration: 3000
            });
            vm.model.qrcode = "";
          })
          .catch(error => {
            var msg;
            if (error) {
              msg = error.toString();
            } else {
              msg = "unknown error";
            }
            this.$toasted.show(msg, {
              theme: "bubble",
              position: "bottom-center",
              duration: 3000
            });
            vm.model.qrcode = "";
          });
      },
      cancelPrivatePowerOfAttorney: function() {
        window.powerOfAttorney = false;
        $("#private-power-of-attorney-cancellation").hide();
      },
      privatePowerOfAttorney: function() {
        window.powerOfAttorney = true;
        $("#private-power-of-attorney-cancellation").show();
      },
      writtenPowerOfAttorney: function() {
        axios
          .post(apiEndpoint + "/scan/powerofattorney", {}, axiosHeaders)
          .then(resp => {
            vm.$toasted.show(
              this.$t("message.powerOfAttorneyRegisteredSuccessfully"),
              {
                theme: "outline",
                position: "bottom-center",
                duration: 3000
              }
            );
          })
          .catch(error => {
            var msg;
            if (error) {
              msg = error.toString();
            } else {
              msg = "unknown error";
            }
            this.$toasted.show(msg, {
              theme: "bubble",
              position: "bottom-center",
              duration: 3000
            });
          });
      },
      votersPass: function() {
        axios
          .post(apiEndpoint + "/scan/voterspass", {}, axiosHeaders)
          .then(resp => {
            vm.$toasted.show(
              this.$t("message.votersPassRegisteredSuccessfyully"),
              {
                theme: "outline",
                position: "bottom-center",
                duration: 3000
              }
            );
          })
          .catch(error => {
            var msg;
            if (error) {
              msg = error.toString();
            } else {
              msg = "unknown error";
            }
            this.$toasted.show(msg, {
              theme: "bubble",
              position: "bottom-center",
              duration: 3000
            });
          });
      },
      objection: function() {
        axios
          .post(apiEndpoint + "/scan/objection", {}, axiosHeaders)
          .then(resp => {
            vm.$toasted.show(
              this.$t("message.objectionToPilotRegisteredSuccessfully"),
              {
                theme: "outline",
                position: "bottom-center",
                duration: 3000
              }
            );
          })
          .catch(error => {
            var msg;
            if (error) {
              msg = error.toString();
            } else {
              msg = "unknown error";
            }
            this.$toasted.show(msg, {
              theme: "bubble",
              position: "bottom-center",
              duration: 3000
            });
          });
      }
    }
  });

  $(function() {
    $("[data-attorney]").on("click", function() {
      $("#power-attorney .btn-submit").attr("disabled", false);
      if ($(this).data("attorney") == "written") {
        $("#power-attorney .btn-submit").attr({
          "data-toggle": "modal",
          "data-target": "#written-authorization"
        });
      } else {
        $("#power-attorney .btn-submit").removeAttr("data-toggle data-target");
      }
    });
  });

  $(function() {
    $("#private-power-of-attorney-cancellation button");
  });

  // $(function () {
  //     ScanditSDK.configure("AeZLeVnFQmmLDSv+HhSiDM9FLzaOEj7bymQpv19+08+RaGxu/S0/Xast++uNJkUfjW09/O9aO/9CXFQWGk3uzPtKpJGuLzfwIh3eBUcFUbVrePN6NxgqUwBxgBsyaZTZnHhrzLhec7y6J3Oy9FAHGDzDQHOf7mpam1zypXH7qym+Tzi2TlcvmTNYMtw09ga1F1nvODmiqDZspZvHe/NTnV4yKkay2i8B0dy6UKNsm2kakpa5jE+RNZ2o6JoHq2NeUolUhTkRJPESE4WUHY5a4q2OOE8NteTFA4ReKdGG6i6+xihcp1zoNeUy+0vWU/mE8alM552i86sF+BUr7dgch4rV3DCTJFMQr4hD78Kq5fYisvzI/CAZoGhzmqvLGPNmDLqC/4bVeVDuylMvlpPEoYz1h0XSAThQ68F084KR/Uid8KwquVnDLuWQSl17EYD8MA9YGh7cSbBpAAfmCVdqSXlw8NveGYmLsXsggiGGLNALZ5QEqq15a+5O7Q+m1FePEUbhYZwIt8rYzXKefSw8R9BxKrniBf6x1m/QAaja/zK6AJAI3EH944osLBTAWSvkVETlmKiKNnOGiKlfLlqrD/5Z9zqiEOgRMKdpNVCJ8Oy2oRzo+fN+wk/ZElHIRaoh8k3iZoBEWvh17Qb/TBiJ//sXALD9lqBn0m3nVjaovzDU2oi5S6TSEbHSxc+paez/KiHcYtirToarHIc+zYbCZj01dlJRRztECFkkfSE36SVxyP0cT0wB2xhSIokeY7z3ej1EaivmmyPEg5uTbqO7VBLxLQmyw4XWjbpSLGUEvnFDlDpyEBZjyGNOwCk4", {
  //         engineLocation: "js"
  //     });
  //     ScanditSDK.BarcodePicker.create(document.getElementById("scandit-barcode-picker"), { playSoundOnScan: true, vibrateOnScan: true })
  //         .then(function (barcodePicker) {
  //             var scanSettings = new ScanditSDK.ScanSettings({ enabledSymbologies: ["data-matrix",], codeDuplicateFilter: 5000 });
  //             barcodePicker.applyScanSettings(scanSettings);
  //             barcodePicker.onScan(function (scanResult) {
  //                 document.getElementById("scandit-barcode-result").innerHTML = scanResult.barcodes.reduce(function (string, barcode) {
  //                     var postAction;
  //                     if (window.powerOfAttorney) {
  //                         postAction = '/scan/powerofattorney';
  //                     }
  //                     else {
  //                         postAction = '/scan/qrcode';
  //                     }
  //                     var _model = {
  //                         code: barcode.data
  //                     }
  //                     axios.post(apiEndpoint + postAction, _model, axiosHeaders)
  //                         .then(resp => {
  //                             vm.$toasted.show(vm.$t('message.scanSuccessfull'), {
  //                                 theme: "outline",
  //                                 position: "bottom-center",
  //                                 duration: 3000
  //                             });
  //                             //must hide the cancellation form
  //                             window.powerOfAttorney = false;
  //                             $('#private-power-of-attorney-cancellation').hide();
  //                         })
  //                         .catch(error => {
  //                             //must hide the cancellation form
  //                             if (error && error.response && error.response.data && error.response.data.message) {
  //                                 vm.$toasted.show(error.response.data.message, {
  //                                     theme: "bubble",
  //                                     position: "bottom-center",
  //                                     duration: 3000
  //                                 });
  //                             }
  //                             window.powerOfAttorney = false;
  //                             $('#private-power-of-attorney-cancellation').hide();
  //                         });
  //                     return string + barcode.data + "<br>";
  //                 }, "");
  //             });
  //             barcodePicker.onScanError(function (error) {

  //             });
  //         })
  //         .catch(function (error) {

  //         });
  // });
});
