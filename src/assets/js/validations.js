export default class Validation{

    valIsEmailValid = false;

    isEmailValid(elem, text){
        //btn is passed
        
        let isEmpty = text.length===0;
        let regex = /.+@redberry\.ge$/;
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
        console.log('update styles')
  
        switch(state) {
            case "empty":
                console.log("case1")
                elem.removeClass('input--success');
                elem.addClass('input--error');
                elem.siblings('.hint--icon-empty').show();
                elem.siblings('.hint--icon-wrong').hide();
                elem.siblings('.hint--icon-none').hide();
                break;
            case "invalid":
                console.log("case2")

                elem.removeClass('input--success');
                elem.addClass('input--error');
                elem.siblings('.hint--icon-empty').hide();
                elem.siblings('.hint--icon-wrong').show();
                elem.siblings('.hint--icon-none').hide();
                break;
            case "none":
                console.log("case3")

                elem.removeClass('input--success');
                elem.addClass('input--error');
                elem.siblings('.hint--icon-empty').hide();
                elem.siblings('.hint--icon-wrong').hide();
                elem.siblings('.hint--icon-none').show();
                break;
            case "valid":
                console.log("case4")

                elem.removeClass('input--error');
                elem.addClass('input--success');
                elem.siblings('.hint--icon-empty').hide();
                elem.siblings('.hint--icon-wrong').hide();
                elem.siblings('.hint--icon-none').hide();
                break;
            default:
                console.log("case5")

                elem.removeClass('input--success');
                elem.removeClass('input--error');
                elem.siblings('.hint--icon-empty').hide();
                elem.siblings('.hint--icon-wrong').hide();
                elem.siblings('.hint--icon-none').hide();
                
        }
    }
    setFinalStatus(elem) {
        let formStatus = this.valIsTextValid;
        if(formStatus){
            elem.prop('disabled', false);
            elem.removeClass('disabled');
          }else{
            elem.prop('disabled', true);
            elem.addClass('disabled');
          } 

        // return this.valIsPhoneValid && this.valIsTextValid;
    }
    
}