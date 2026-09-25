import express from "express"

const app = new express();
const port = 3000;

app.get("/",(req, res)=>{
    res.json({
        message:"welcome to Atmiya University"
    });
});

app.get("/name/:rollno",(req, res)=>{

    const rollno = req.params.rollno;
    let name = "NA"
    if(rollno == 1)
    {
        name = "Akshay";
    }
    if(rollno == 2)
    {
        name = "Pooja";
    }

    res.json({
        message:"Found",
        rollno:rollno,
        name:name
    });
});


app.listen(port,()=>{
    console.log(`application running on: http://localhost:${port}`)
})