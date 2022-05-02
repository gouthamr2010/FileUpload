sap.ui.define(
    ["sap/ui/core/mvc/Controller"],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("com.gr.demo.controller.App", {
            onInit: function () { },

            onAfterItemAdded: function (oEvent) {
                var oItem = oEvent.getParameter("item")
                this._createEntity(oItem)
                    .then((id) => {
                        this._uploadContent(oItem, id);
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            },

            onUploadCompleted: function (oEvent) {
                var oUploadSet = this.byId("uploadSet");
                oUploadSet.removeAllIncompleteItems();
                oUploadSet.getBinding("items").refresh();
            },

            _createEntity: function (oItem) {
                var data = {
                    mediaType: oItem.getMediaType(),
                    fileName: oItem.getFileName(),
                    size: oItem.getFileObject().size
                };

                var settings = {
                    url: "/v2/attachments/Files",
                    method: "POST",
                    headers: {
                        "Content-type": "application/json"
                    },
                    data: JSON.stringify(data)
                }

                return new Promise((resolve, reject) => {
                    $.ajax(settings)
                        .done((results, textStatus, request) => {
                            resolve(results.d.ID);
                        })
                        .fail((err) => {
                            reject(err);
                        })
                })
            },

            _uploadContent: function (oItem, id) {
                var oUploadSet = this.byId("fileUpload");
                var url = `/v2/attachments/Files(${id})/content`
                oItem.setUploadUrl(url);
                oUploadSet.setHttpRequestMethod("PUT");
                oUploadSet.uploadItem(oItem);
            }
        });
    }
);
