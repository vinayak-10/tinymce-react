import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import FormData from 'form-data';

export default function App() {
  const editorRef = useRef(null);
  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };

  const query_string = (which) => {
        let search = window.location.search;
        let params = new URLSearchParams(search);
        let id = params.get(which);
        console.log(id);
        return id;
  };

  const image_uploader = (blobInfo, progress) => new Promise((resolve, reject) => {
      let url =  'http://api.dwall.xyz/v1/upload';
      let formData = new FormData();
      formData.append('upload_file', blobInfo.blob(), blobInfo.filename());
      let resp = fetch ( url,
              {
                  method: "POST",
                  body: formData,
              } )
              .then(response => response.json())
              .then(data => resolve( "http://api.dwall.xyz/images/" + data.filename ));
  });

  const form_upload = (content) => {
    let url =  'http://api.dwall.xyz/v1/post/add';

    let user = query_string('Author');

    let resp = fetch ( url,
            {
                method: "POST",
                body: JSON.stringify( { Author: user,
                                      Post: content }),
                headers: {
                        'Accept' : 'application/json; charset=UTF-8',
                        'Content-Type': 'application/json; charset=UTF-8'
                    },
            } )
            .then(response => response.json())
            .then(data => console.log(data));
  };


  return (
    <>
      <Editor
        onInit={(evt, editor) => {
           editorRef.current = editor;
           editor.execCommand('mceFullScreen');
         }
       }
	      tinymceScriptSrc="http://editor.dwall.xyz/static/js/tiny/tinymce.min.js"
        initialValue="<p>your wall content here...</p>"
        init={{
            plugins: 'autolink autosave template fullscreen emoticons autoresize a11ychecker imagetools paste addcomment save styleselect advcode casechange export formatpainter image editimage linkchecker autolink lists checklist media link code mediaembed pageembed permanentpen powerpaste table advtable tableofcontents tinycomments tinymcespellchecker',
            toolbar: 'fullscreen | save restoredraft | fontsizeselect | fontfamily blocks| forecolor backcolor | bold italic underline | alignleft aligncenter alignright alignjustify | outdent indent | undo redo | link image media |  code | template',
            toolbar_mode: 'scrolling',
            toolbar_location: 'bottom',
            toolbar_sticky: true,
            fontsize_formats: "8pt 10pt 12pt 14pt 18pt 24pt 36pt",
            skin: (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'oxide-dark' : 'oxide'),
            content_css: (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'default'),
            width: 'device-width',
            height: 'device-height',
            paste_data_images: true,
            menubar: false,
            tinycomments_mode: 'embedded',
            tinycomments_author: 'Author name',
            statusbar: false,
            menubar: true,
            media_alt_source: false,
                  media_dimensions: false,
            media_filter_html: false,
            mobile: {
               menubar: false
            },

            save_onsavecallback: () => {
                  editorRef.current.uploadImages();
                  form_upload(editorRef.current.getContent());
                  log();
            },
            save_oncancelcallback: () => {
                  console.log('Save canceled');
            },
            init_instance_callback : function(editor) {
              /*
                var mceNotif = document.querySelector('.mce-notification');
                mceNotif.style.display = 'none';
                */
		            var toxNotif = document.querySelector('.tox .tox-notification--in');
                toxNotif.style.display = 'none';

                editor.execCommand('mceFullScreen');

                console.log("Instance Initialized");
            },

            templates: (callback) => {
              const templates = [
                { 'title': 'Some title 1', 'description': 'Some desc 1', 'content': 'My content' },
                { 'title': 'Some title 2', 'description': 'Some desc 2', 'url': 'development.html' }
              ];
              callback(templates);
            },

            automatic_uploads: true,
            images_upload_handler: image_uploader,

        }}
      />
    </>
  );
}
