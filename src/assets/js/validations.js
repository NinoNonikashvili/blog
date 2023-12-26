class EmailValidation{

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
        console.log('before set',this.valIsEmailValid)

        this.valIsEmailValid =  !isEmpty && !isWrong;
        console.log('after set',this.valIsEmailValid)
    }
    applyEmailStyles(elem, state){

        //btn is passed
        console.log('update styles')
  
        switch(state) {
            case "empty":
                console.log("case1")
                elem.removeClass('input--success');
                elem.addClass('input--error');
                elem.siblings('#authEmailEmpty').show(); //#authEmailEmpty
                elem.siblings('#authEmailWrong').hide(); //#authEmailWrong
                elem.siblings('#authEmailNone').hide(); //#authEmailNone
                break;
            case "invalid":
                console.log("case2")

                elem.removeClass('input--success');
                elem.addClass('input--error');
                elem.siblings('#authEmailEmpty').hide();
                elem.siblings('#authEmailWrong').show();
                elem.siblings('#authEmailNone').hide();
                break;
            case "none":
                console.log("case3")

                elem.removeClass('input--success');
                elem.addClass('input--error');
                elem.siblings('#authEmailEmpty').hide();
                elem.siblings('#authEmailWrong').hide();
                elem.siblings('#authEmailNone').show();
                break;
            case "valid":
                console.log("case4")

                elem.removeClass('input--error');
                elem.addClass('input--success');
                elem.siblings('#authEmailEmpty').hide();
                elem.siblings('#authEmailWrong').hide();
                elem.siblings('#authEmailNone').hide();
                break;
            default:
                console.log("case5")

                elem.removeClass('input--success');
                elem.removeClass('input--error');
                elem.siblings('#authEmailEmpty').hide();
                elem.siblings('#authEmailWrong').hide();
                elem.siblings('#authEmailNone').hide();
                
        }
    }
    setFinalStatus(elem) {
        let formStatus = this.valIsEmailValid;
        console.log('in final status',this.valIsEmailValid)
        if(formStatus){
            elem.prop('disabled', false);
            elem.removeClass('disabled');
          }else{
            elem.prop('disabled', true);
            elem.addClass('disabled');
          } 

    }
    
}

class PostValidations{
    valIsImglValid = false;
    valIsTitleValid = false;
    valIsAuthorValid = false;
    valIsDescValid = false;
    valIsDateValid = false;
    valIsCatValid = false;
    valIsEmailValid = false;
    

    setFinalStatus(elem) {
        let formStatus = this.valIsImglValid
                        && this.valIsTitleValid
                        && this.valIsAuthorValid
                        && this.valIsDescValid
                        && this.valIsDateValid
                        && this.valIsCatValid
                        && this.valIsEmailValid;
        if(formStatus){
            elem.prop('disabled', false);
            elem.removeClass('disabled');
          }else{
            elem.prop('disabled', true);
            elem.addClass('disabled');
          } 

    }

}

export {
    EmailValidation,
    PostValidations
}