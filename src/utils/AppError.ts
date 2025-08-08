class AppError extends Error{
    public status_code : number | unknown = null;
    public error_type : string | unknown = null;

    constructor(message : string,status_code : number, error_type : string){
        super();
        this.message = message;
        this.error_type =  error_type;
        this.status_code =  status_code;
    }
}

export default AppError;