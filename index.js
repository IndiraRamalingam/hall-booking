
const express=require('express');
const app=express();
const cors=require('cors');

//middleware
app.use(cors());
app.use(express.json());

//JSON Data
let rooms =[
    {
        room_id:1,
        room_name:"Hall 1 - Premium",
        seats:100,
        amenities :"Air-conditioning, Free Wi-Fi, Sound System, Generator",
        price:1500,
        bookingDetails:[
            {
                customer_name:"Indira",
                room_id:1,
                date:"14-07-2023",
                start_time:"07.00",
                end_time:"10.00",
                status:"Confirmed",
            },
        ]
    },
    {
        room_id:2,
        room_name:"Hall 2 - Elite",
        seats:50,
        amenities :"Air-conditioning, Sound System",
        price:1000,
        bookingDetails:[
            {
                customer_name:"Deepa",
                room_id:2,
                date:"15-07-2023",
                start_time:"10.00",
                end_time:"12.00",
                status:"Payment Pending",
            }
        ]
    }
];


//common api endpoint
app.get('/',(request,response) =>{
     response.send(`<h2>Welcome to Hall Booking API</h2>
                    <h4>/create-room</h4> 
                    <h4>/book-room</h4>
                    <h4>/booked-rooms</h4>
                    <h4>/list-customers</h4>`)
 });

//set the endpoints to create a room 

app.post('/create-room',(request,response)=>{
    rooms.push({
        room_id:`${rooms.length+1}`,
        room_name: request.body.room_name,
        seats: request.body.seats,
        amenities:request.body.amenities,
        price:request.body.price,
    
    });
    response.send(rooms)
})

//set the endpoints to book a room

app.post('/book-room',(request,response)=>{
    for (let i = 0; i <= rooms.length; i++) {
        if(!(rooms[i].room_id === request.body.room_id))
        {
            return response.status(400).send({error:"Invalid"})
        }
        else
        {
            let booking={
                customer_name:request.body.customer_name,
                date:request.body.date,
                start_time:request.body.start_time,
                end_time:request.body.end_time,
                room_id:request.body.room_id,
                status:"confirmed",
            };
            
            let result=undefined;
            rooms[i].bookingDetails.forEach((book) =>{
                if(book.date == booking.date &&
                book.start_time === booking.start_time)
                {
                    result =0;
                    console.log("In Booking")
                }
                else{
                    result=1;
                    rooms[i].bookingDetails.push(booking);
                }
            });
            if(result)
            {
                return response.status(200).send({message:"Booking Confirmed"});
            }
            else{
                 return response.status(400).send({error:"Please select different time slot..."});
            }
        }
    } 
});  


//set the endpoints to list all rooms with Booked_Data with Room_name, Room_status, Customer_name, Date, Start_time, End_Time as per document

app.get('/booked-rooms',(request,response) =>{
    let rooms_display=[];
    rooms.forEach((room)=>{
        let r_name={room_name:room.room_name};       
              room.bookingDetails.forEach((customer)=>{
                r_name.customer_name=customer.customer_name;
                r_name.date=customer.date;
                r_name.start_time=customer.start_time;
                r_name.end_time=customer.end_time;
                r_name.status=customer.status;
                rooms_display.push(r_name);
            });
    });
    
    response.json(rooms_display)
  });

//set the endpoints to list all customers with Booked_Data with Room_name, Customer_name, Date, Start_time, End_Time as per document

app.get('/list-customers',(request,response) =>{
    let customer_display=[];
    rooms.forEach((room)=>{
        let r_name={room_name:room.room_name};       
              room.bookingDetails.forEach((customer)=>{
                r_name.customer_name=customer.customer_name;
                r_name.date=customer.date;
                r_name.start_time=customer.start_time;
                r_name.end_time=customer.end_time;
                customer_display.push(r_name);
            });
    });
    
    response.json(customer_display)
  });

const PORT=3001;
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});