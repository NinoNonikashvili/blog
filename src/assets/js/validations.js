export default class Validation{

    valIsEmailValid = false;

    valIsPhoneValid = false;

    

    isEmailValid(elem, text){
        //btn is passed
        
        let isEmpty = text.length===0;
        let regex = /@redberry\.ge$/;
        let isWrong = !regex.test(text);

        if(isEmpty){
            this.applyEmailStyles(elem, "empty")
        }else if(isWrong){
            this.applyEmailStyles(elem, "invalid")
        } else{
            this.applyEmailStyles(elem, "valid")
        }

        this.valIsTextValid =  !isEmpty && !isWrong;
    }
    applyEmailStyles(elem, state){

        //btn is passed
  
        switch(state) {
            case "empty":
                elem.addClass('input--error');
                elem.siblings('.hint--icon-empty').show();
                elem.siblings('.hint--icon-wrong').hide();
                elem.siblings('.hint--icon-none').hide();
                break;
            case "invalid":
                elem.addClass('input--error');
                elem.siblings('.hint--icon-empty').hide();
                elem.siblings('.hint--icon-wrong').show();
                elem.siblings('.hint--icon-none').hide();
                break;
            case "none":
                inputElem.addClass('input--error');
                elem.siblings('.hint--icon-empty').hide();
                elem.siblings('.hint--icon-wrong').hide();
                elem.siblings('.hint--icon-none').show();
                break;
            case "valid":
                elem.addClass('input--success');
                elem.siblings('.hint--icon-empty').hide();
                elem.siblings('.hint--icon-wrong').hide();
                elem.siblings('.hint--icon-none').hide();
                break;
            default:
                
        }
    }


    setFinalStatus(elem) {
        let formStatus = this.valIsPhoneValid && this.valIsTextValid
        if(formStatus){
            elem.prop('disabled', false)
          }else{
            elem.prop('disabled', true)
          } 

        // return this.valIsPhoneValid && this.valIsTextValid;
    }
    
}