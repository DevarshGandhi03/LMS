const errorMiddleware = (err,req,res,next)=>{

  return  res.status(err.statusCode||400).json({

        message:err.message||"Something went wrong !!" ,
        success:false
    })
}

export default errorMiddleware;