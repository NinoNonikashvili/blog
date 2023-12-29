import $ from 'jquery';



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

        this.valIsEmailValid =  !isEmpty && !isWrong;
    }
    applyEmailStyles(elem, state){

        //btn is passed
  
        switch(state) {
            case "empty":
                elem.removeClass('input--success');
                elem.addClass('input--error');
                elem.siblings('#authEmailEmpty').show(); //#authEmailEmpty
                elem.siblings('#authEmailWrong').hide(); //#authEmailWrong
                elem.siblings('#authEmailNone').hide(); //#authEmailNone
                break;
            case "invalid":

                elem.removeClass('input--success');
                elem.addClass('input--error');
                elem.siblings('#authEmailEmpty').hide();
                elem.siblings('#authEmailWrong').show();
                elem.siblings('#authEmailNone').hide();
                break;
            case "none":

                elem.removeClass('input--success');
                elem.addClass('input--error');
                elem.siblings('#authEmailEmpty').hide();
                elem.siblings('#authEmailWrong').hide();
                elem.siblings('#authEmailNone').show();
                break;
            case "valid":

                elem.removeClass('input--error');
                elem.addClass('input--success');
                elem.siblings('#authEmailEmpty').hide();
                elem.siblings('#authEmailWrong').hide();
                elem.siblings('#authEmailNone').hide();
                break;
            default:

                elem.removeClass('input--success');
                elem.removeClass('input--error');
                elem.siblings('#authEmailEmpty').hide();
                elem.siblings('#authEmailWrong').hide();
                elem.siblings('#authEmailNone').hide();
                
        }
    }
    setFinalStatus(elem) {
        let formStatus = this.valIsEmailValid;
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
    valIsEmailValid = true;
    
    isImgValid(state){
        this.valIsImglValid = state;
    }
    isTitleValid(elem){
        let isWrong = elem.val().length < 2;
        this.applyTitleStyles(elem, isWrong);
        this.valIsTitleValid = !isWrong;
        

    }
    applyTitleStyles(elem, isWrong){
        if(isWrong){
            //apply error styles
            elem.addClass('input--error');
            elem.removeClass('input--success');
            $('#postTitleWrong').addClass('hint--error');
            $('#postTitleWrong').removeClass('hint--success');
        }else{
            //apply success styles
            elem.addClass('input--success');
            elem.removeClass('input--error');
            $('#postTitleWrong').addClass('hint--success');
            $('#postTitleWrong').removeClass('hint--error');
        }

    }

    isAuthorValid(elem){
        let regex = /^[ა-ჰ ]+$/;
        let text = elem.val();
        let isNotGeorgian = !regex.test(text);
        let isNotFourChar = text.length < 4;
        let isNotTwoWords = !text.includes(' ');

        this.valIsAuthorValid = !isNotGeorgian && !isNotFourChar && !isNotTwoWords;

      
        if(isNotGeorgian){
            this.applyAuthorStyles(elem, 'langError', 'error')
        }else{
            this.applyAuthorStyles(elem, 'langSuccess', 'success')
        }

        if(isNotFourChar){
            this.applyAuthorStyles(elem, 'symbolError', 'error')
        }else{
            this.applyAuthorStyles(elem, 'symbolSuccess', 'success')
        }

        if(isNotTwoWords){
            this.applyAuthorStyles(elem, 'wordError', 'error')
        }else{
            this.applyAuthorStyles(elem, 'wordSuccess', 'success')
        }



    }

    applyAuthorStyles(elem, detailedState, state) {
        switch(detailedState) {
            case 'langError':             
                $('#postAuthorWrongLang').addClass('hint--error');
                $('#postAuthorWrongLang').removeClass('hint--success');
            break;
            case 'langSuccess':
                $('#postAuthorWrongLang').addClass('hint--success');
                $('#postAuthorWrongLang').removeClass('hint--error');
            break;
            case 'symbolError':
                $('#postAuthorWrongSymbol').addClass('hint--error');
                $('#postAuthorWrongSymbol').removeClass('hint--success');
            break;
            case 'symbolSuccess':
                $('#postAuthorWrongSymbol').addClass('hint--success');
                $('#postAuthorWrongSymbol').removeClass('hint--error');
            break;
            case 'wordError':
                $('#postAuthorWrongWord').addClass('hint--error');
                $('#postAuthorWrongWord').removeClass('hint--success');
            break;
            case 'wordSuccess':
                $('#postAuthorWrongWord').addClass('hint--success');
                $('#postAuthorWrongWord').removeClass('hint--error');
            break;

        }
        if(this.valIsAuthorValid){
                elem.addClass('input--success');
                elem.removeClass('input--error');
        }else{
                elem.addClass('input--error');
                elem.removeClass('input--success');
            }
                
        }

    isDescValid(elem) {

        let isWrong = elem.val().length < 4;
        this.applyDescStyles(elem, isWrong);
        this.valIsDescValid = !isWrong;

    }
    applyDescStyles(elem, state){
        if(state){
            //apply error styles
            elem.addClass('input--error');
            elem.removeClass('input--success');
            $('#postDescWrong').addClass('hint--error');
            $('#postDescWrong').removeClass('hint--success');
        }else{
            //apply success styles
            elem.addClass('input--success');
            elem.removeClass('input--error');
            $('#postDescWrong').addClass('hint--success');
            $('#postDescWrong').removeClass('hint--error');
        }
    }
    isDateValid(elem){
        let isWrong = elem.val().length <1;
        this.applyDateStyles(elem, !isWrong);
        this.valIsDateValid = !isWrong;
    }
    applyDateStyles(elem, state) {
        if(state){
            elem.addClass('input--success');
            elem.removeClass('input--error');
        }else{
            elem.addClass('input--error');
            elem.removeClass('input--success');
        }
    }
    isCatValid(elem){
        let cats = localStorage.getItem('selectedCatInput');
        let cat_ids = [];
        if(typeof(cats) === 'string' && cats.length !== 0){
            this.valIsCatValid = true;
            this.applyCatStyles(elem, true)
            //return cat_ids
        }else{
            this.valIsCatValid = false;
            this.applyCatStyles(elem, false)
            return false;
        }

    }
    applyCatStyles(elem, state){
        if(state){
            elem.addClass('input--success');
            elem.removeClass('input--error');
        }else{
            elem.addClass('input--error');
            elem.removeClass('input--success');
        }
    }

    isEmailValid(elem){
        //btn is passed
        let text = elem.val();
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

        this.valIsEmailValid =  !isWrong || isEmpty;
    }

    applyEmailStyles(elem, state){

        //btn is passed
  
        switch(state) {
            case "empty":
                elem.removeClass('input--success');
                elem.removeClass('input--error');
                $('#postEmailWrong').hide();
                break;
            case "invalid":

                elem.removeClass('input--success');
                elem.addClass('input--error');
                $('#postEmailWrong').show();
                break;                
            case "valid":

                elem.removeClass('input--error');
                elem.addClass('input--success');
                $('#postEmailWrong').hide();
                break;
            default:

                elem.removeClass('input--success');
                elem.removeClass('input--error');
                $('#postEmailWrong').hide();
        }
    }
        
    

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