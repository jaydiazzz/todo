/*
 * emphasize element
 * $element - jQuery element - element to be emphasized
 */
const emphasize = function emphasizeHTMLELementOnPage( $element ) {
  let initialPadding = $element.css("padding-left");
  $element.animate({
    paddingLeft: "10px"
  }, 400, function() {
    $element.animate({
      paddingLeft: initialPadding
    }, 400)
  });
}

const inform = function displayInformationalPopUp( args ) {

  let html = "<div class='popUpContainer informationalPopUp'><div class='popUpWrapper transparent'>";

    html += "<h1>" + args.title + "</h1>";
    html += "<p>" + args.message + "</p>";
    html += "<div class='closeInformation button'>okay</div>";

  html += "</div></div>"

  $('body').append(html);

  $('.closeInformation').on('click', ( e ) => {

    let $target = $( e.target ).closest('.informationalPopUp');

    $target.remove();

  })

}

const displayPopUp = function showPopUpWithMessageAndButtons( args ) {
  let html = "<div class='popUpContainer'><div class='popUpWrapper'>";
  // add title
  if ( args.hasOwnProperty( "title" ) ) 
    html += "<h1 class='popUpTitle'>" + args.title + "</h1>";

  // add message
  if ( args.hasOwnProperty( "message" ) )
    html += "<p class='popUpMessage'>" + args.message + "</p>";

  let type = args.type;

  switch ( type ) {
    case "confirm" :
      if ( args.buttonText == undefined ) {
        args.buttonText = {
          confirm : "Okay",
          deny    : "Cancel"
        }
      }

      let buttons = args.buttonText;
      html += "<div class='popUpButtons'>";
        html += "<div class='button popUpButton confirmButton'>" + buttons.confirm + "</div>";
        if ( buttons.deny != undefined )
          html +="<div class='button popUpButton removePopUp'>" + buttons.deny + "</div>";
      html += "</div>";
      break; 
  }
  html += "</div></div>";

  $("body").prepend( html );

  switch( type ) {
    case "confirm" :
      $(".confirmButton").on('click', function( e ) {
        args.action( e );
      })

      $(".removePopUp").on("click", ( e ) => {
        $(".popUpContainer").remove();

      })
  }
}

/*
 * Hides form after submit is clicked, shows thank you message.
 *
 * $form - jQuery element - form to act on 
 */
const formConfirmation = function hideInputAfterFormConfirmsSend( $form ){

  ( $form ).slideUp( 600, function(){
    $('.input-label').hide();
    $form.children('.input').hide();
    $('.stay-in-touch-button').hide();
    //thank you popUP
    ( $form ).prepend("<p class='thank-you'>Thank You!</p>").slideDown().fadeIn(600);
    ( $form ).append("<p class='thank-you'>We'll be in touch!</p>").slideDown().fadeIn(600);

  });

};

/*
 * Create a form popup
 *
 * options - object - instructions to create the form
 * example:
   * {
   *   title : "Form Name",
   *   description : "This is a simple example of a form description",
   *   buttonText : "Submit",
   *   rows : [
   *   [
   *     {
   *       label : "First input in row 1",
   *       name  : "firstInput",
   *       type  : "text"
   *     },
   *     {
   *       label : "Second input in row 1",
   *       name  : "secondInput",
   *       type  : "text"
   *     }
   *   ],
   *   [
   *     {
   *       label : "Second row input",
   *       name  : "secondRow",
   *       type  : "text"
   *     }
   *   ],
   *   [
   *     {
   *       label : "Third row input",
   *       name  : "thirdRow",
   *       type  : "text"
   *     }
   *   ],
   * ]
 *
 * callback - function - function to handle data input
 */
const formModule = function createFormPopUpModule( options, callback ) {

  let formType = options.formType == undefined ? 'default' : options.formType;

  // generate form html

  let formHtml = '';

  formHtml += "<div id='formModule'>";
    formHtml += "<div id='exitFormModule' class='exit-icon material-icons'></div>";
    formHtml += "<div class='form-module-container'>";
      formHtml += "<h1 class='title'>" + options.title + "</h1>";
      formHtml += "<p class='description'>" + options.description + "</p>";
      formHtml += "<div class='form-wrapper'>";
  
  switch( formType ) {

    case 'default' :

      let rows = options.rows;
      
        formHtml += "<form id='popUpForm'>";

        for ( i in rows ) {

          let row = rows[ i ];

          formHtml += "<div class='form-row'>";

          for ( n in row ) {

            let input = row[ n ];

            if ( input.type == 'image' ) {
              formHtml += "<div class='input image-input'>";
                formHtml += "<label for='file-upload'>";
                  formHtml += "<input id='file-upload' type='file' name='" + input.name + "' class='file-upload' />";
                  formHtml += "<div class='image-preview-container'>";
                    formHtml += "<i class='material-icons circle' data-name='" + input.name + "'>camera_alt</i>";
                    formHtml += "<img id='image-preview'>";
                  formHtml += "</div>";
                formHtml += "</label>";
                formHtml += "<p class='input-label image-label'>" + input.label + "</p>";
              formHtml += "</div>";
              continue;
            }

            let value = input.value != undefined ? input.value : '';

            formHtml += "<div class='input'>";
              formHtml += "<p class='input-label'>" + input.label + "</p>";
              formHtml += "<input name='" + input.name + "' type='" + input.type + "' value='" + value + "'>"
            formHtml += "</div>";

          }

          formHtml += "</div>";

        }

        // submit button

        formHtml += "<div class='wrapper'>";
          formHtml += "<div id='submitFormModule' class='continue-button button'>" + options.buttonText + "</div>";
        formHtml += "</div>";

      break;

    case 'options' :

      let selectOptions = options.options;
      let format        = options.format;
      let style         = false;

      if ( options.hasOwnProperty('style') )
        style = options.style;

        formHtml += "<div id='optionsForm'>";

        for ( i in selectOptions ) {

          let option = selectOptions[i];

          formHtml += '<div class="formOption"';

          if ( style != false ) {

            formHtml += 'style="';

            for ( n in style ) {

              let attr  = n;
              let value = style[n];

              switch( attr ) {
                case 'background-image' :

                  if ( value.split('.')[0] == 'option' ) {
                    formHtml += attr + ': ' + 'url(' + option[ value.split('.').pop() ] + ')';
                  }
                  else {
                    formHtml += attr + ': ' + 'url(' + value + ')';
                  }

                  formHtml += ';';

                  break;
                default:

                  if ( value.split('.')[0] == 'option' ) {
                    formHtml += attr + ': ' + option[ value.split('.').pop() ];
                  }
                  else {
                    formHtml += attr + ': ' + value;
                  }

                  formHtml += ';';

                  break;
              }

            }

            formHtml += '"';

          }


          formHtml += '>';

            formHtml += '<div class="formOptionContainer">';

              formHtml += '<svg class="checkWrapper" viewBox="0 0 50 50">';
                formHtml += '<path class="check" d="M14.1 27.2l7.1 7.2 16.7-16.8" fill="none" stroke-width="4" stroke="#3BAB7E"/>';
              formHtml += '</svg>';

              formHtml += "<div class='formOptionWrapper'>";

              for ( n in format ) {

                let tag   = n;
                let value = format[n];
                
                formHtml += '<' + tag + '>' + option[ value ] + '</' + tag + '>';

              }

              formHtml += "</div>";
            formHtml += '</div>';
          formHtml += "</div>";

        }

        formHtml += "</div>";

        // submit button
        formHtml += "<div class='wrapper'>";
          formHtml += "<div id='submitFormModule' class='continue-button button'>" + options.buttonText + "</div>";
        formHtml += "</div>";

      break;

    default :
      console.error('No recognizable formType in parameter: options');

      break;
  }

        formHtml += "</form>";
      formHtml += "</div>"; 
    formHtml += "</div>";
  formHtml += "</div>";


  // append form html

  let $body             = $("body");

  $body.append( formHtml );
  magicForm.init();

  let $submitFormModule = $("#submitFormModule");
  let $exitFormModule   = $("#exitFormModule");
  let $formModule       = $("#formModule");

  switch( formType ) {

    case 'default' :

      let $fileUpload = $('#file-upload');

      if ( $fileUpload.length != 0 ){

        $fileUpload.on('change', ( e ) => {

          let target = e.target;

          let $preview = $('#image-preview');
          let file     = $fileUpload[0].files[0];
          let reader   = new FileReader();

          reader.addEventListener("load", function () {
            $preview.attr( 'src', reader.result );
          }, false);

          if (file) {
            reader.readAsDataURL(file);
          }

          $('.image-label').text( target.files[0].name );

        })

      }

      $submitFormModule.on('click', function( e ) {
        
        let $popUpForm = $("#popUpForm");

        let validForm = magicForm.validateForm( $popUpForm );

        if ( !validForm )
          return callback({
            type: 'invalid_form',
            message : "This form's input is invalid."
          })

        let formData = $popUpForm.serializeArray();

        let formattedData = {};

        for ( i in formData ) {
          let datum = formData[ i ];

          formattedData[ datum.name ] = datum.value;
        }

        if ( $fileUpload.length != 0 )
          formattedData.files = $fileUpload[0].files;

        callback( null, formattedData );

        $formModule.remove();

      })
      break;
    case 'options' :
      let selected = [];

      let $formOption = $('.formOption');

      $formOption.on('click', ( e ) => {

        // get target and toggle class

        let $target = $( e.target );
        if ( !$target.is('.formOption') )
          $target = $target.closest('.formOption');

        $target.toggleClass('selected');

        // get data

        let index = $target.index();
        let datum = options.options[ index ];
        let inArray = false;

        // check if data has already been saved

        for ( i in selected ) {

          if ( selected[i] == datum ) {
            inArray = true;
            delete selected[ i ];
            break;
          }

        }

        if ( !inArray )
          selected.push( datum );

      });

      $submitFormModule.on('click', ( e ) => {

        if ( !selected.length ) {

          console.log( selected );

          let $warning = $('p.warning');

          if( !$warning.length )
            $('.form-module-container').append('<p class="warning center">Please select at least one school</p>');

          return emphasize( $warning );

        }

        callback( null, selected );

        $formModule.remove();

      })


      break;

  }

  $exitFormModule.on('click', ( e ) => {

    $formModule.remove();

  })

};

/*
 * converts object to array
 * obj - object - object to be turned into array
 *
 * returns array
 */
const objToArray = function convertObjectToArray( obj ) {
  
  let array = [];

  for ( i in obj ){

    let objectProperty = obj[i];

    if ( typeof( objectProperty ) == 'object' ) {

      objectProperty.key = i;

    }

    array.push( objectProperty );

  }

  return array;
  console.log( array );

}

/*
 * converts array to object
 * array - array of objects - array to convert into an object (preferrably each of this array's objects have a property called 'key')
 *
 * returns object
 */
const arrayToObj = function convertArrayToObject( array ) {

  let object = {};

  console.log( array );

  for ( i in array ) {

    let arrayItem = array[i];

    if ( typeof( arrayItem ) != 'object' ) {
      console.log( array );
      return console.error('This array has an element that is not an object at index: ' + i + '. This function is only for arrays of objects. Please view the array above.');
    }

    let key = arrayItem.key;

    if ( key == undefined ) {
      console.log( array );
      return console.error( 'An object in this array has no "key" property. Index: ' + i );
    }

    object[ key ] = arrayItem;

  }

  return object;

}

/*
 * converts nested objects into arrays for knockout
 * object - object - object to make friendly
 *
 * returns object
 */
const makeObjectObservableFriendly = function turnObjectIntoKOObservableCompatibleObject ( object = {} ) {

  let keys = Object.keys( object );

  if ( keys.length == 0 )                   // this function called without parameters return
    return { objToArray: objToArray };      // an object to export the objToArray function.

  if ( keys.length == 1 ) {

    return objToArray( object )

  }

  let friendlyObject = {};

  for ( i in object ) {

    let objectProperty = object[ i ];

    if ( typeof( objectProperty ) == 'object' ) {

      friendlyObject[ i ] = objToArray( objectProperty );

      continue;

    }

    friendlyObject[ i ] = object[ i ];

  }

  return friendlyObject;

};

/*
 * build form data into convenient object
 * $form - jQuery element - form to read data from
 *
 * returns object like :
 * {
 *   name : value,
 *   ...
 *   nameN: valueN
 * }
 */
const getFormData = function readDataFromFormAndReturnObject( $form ) {

  let d = $form.serializeArray();
  let returnData = {};

  for ( i in d ) {
    returnData[ d[i].name ] = d[i].value;
  }

  return returnData;

}
