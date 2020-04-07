
jQuery(document).ready(function () {

    jQuery('[data-tbtooltip!=""]').qtip({
        content: {
            attr: 'data-tbtooltip'
        },
        style: {
            classes: 'qtip-youtube-tubebuddy',
            tip: false
        },
        position: {
            at: 'bottom left',
            adjust: {
                x: 100
            }
        }

    });

    jQuery(document).on('click', '.tb-tabs-menu-item-container', function () {

        jQuery(this).parent().find('.tb-tabs-selected-menu-item, .tb-tabs-selected-menu-icon').removeClass('tb-tabs-selected-menu-item tb-tabs-selected-menu-icon');
        jQuery(this).parents().find('.tb-tabs-content').addClass('tb-hid');

        jQuery(this).addClass('tb-tabs-selected-menu-item');
        jQuery(this).find('.tb-tabs-menu-item-icon').addClass('tb-tabs-selected-menu-icon');
        jQuery(this).parents().find('#' + jQuery(this).attr('data-tab')).removeClass('tb-hid');
    });

    //Modal event handler
    jQuery(document).on('click', '.tb-generate-btn', function generateHtml() {

        const newText = '<!--Start Base Module Template-->\n<div id="tb-#TEMPLATENAME#-container" class="tb-module-template draggable-container" style="display:none; width:600px">\n  <!--Start Base Module Shadow-->\n  <div class="tb-module-shadow">\n   <!--Start BASE Module Header-->\n   <div class="tb-module-header" data-draggable="true">\n    <img class="tb-module-logo " src="{PLUGIN_FILE_ROOT}/images/branding/tb-icon.svg" alt="tb-logo" data-draggable="false" />\n    <h1 class="tb-module-title">#TITLE#</h1>\n     <div class="tb-module-help">\n      <a style="vertical-align: middle;text-decoration: none;" target="_blank" href="{HOST}/tools?tool=#TOOL#" data-draggable="false">\n       <i class="small material-icons tb-icon-white tb-icon-help">help_outline</i>\n      </a>\n     </div>\n     <div class="tb-module-close" data-draggable="false">\n      <i class="medium material-icons tb-icon-white" data-draggable="false">close</i>\n     </div>\n    </div>\n   <!--End Base Module Header-->\n   <div class="tb-module-container">\n    <div class="tb-module-embed-video">\n     <div class="tb-embed-video-thumbnail-container">\n      <img id="tb-#TEMPLATENAME#-video-thumbnail" class="tb-embed-video-thumbnail" />\n     </div>\n     <div class="tb-embed-video-link-container">\n      <a id="tb-#TEMPLATENAME#-video-link" class="tb-embed-video-link" target="_blank"></a>\n     </div>\n    </div>\n    <!--Start Base Module Container-->\n    <div class="tb-module-content">\n     <div> this is the content</div>\n    </div>\n    <!--End BASE Module Container-->\n   </div>\n   <!--Start BASE Footer Module-->\n   <div class="tb-module-footer">\n    <a class="tb-btn tb-btn-grey tb-module-close" id="tb-dc-close">Close</a>\n   </div>\n   <!--End BASE Footer-->\n  </div>\n  <!--End BASE Shadow-->\n</div>\n<!--End BASE Module Template-->';

        var templateName = '';
        var title = '';
        var tool = '';

        templateName = jQuery('#tb-template-generate').val();
        title = jQuery('#tb-title-generate').val();
        tool = jQuery('#tb-tool-generate').val();

        if (templateName == '' || title == '' || tool == '') {
            jQuery('.tb-input-error').show('slow');
        } else {

            jQuery('#tb-modal-textarea').text(newText);
            //Replace TEMPLATENAME TITLE & TOOL
            jQuery("#tb-modal-textarea").text(function () {
                return $(this).text().replace(/#TEMPLATENAME#/g, templateName).replace("#TITLE#", title).replace("#TOOL#", tool);
            });

            jQuery('.tb-input-error').hide('slow');
        }

    });

});



