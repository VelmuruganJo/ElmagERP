import { useEffect, useState } from "react";
import API from "../services/api";
import "./AdminDashboard.css";


const transformerModels = [
  "1200VA",
  "850VA",
  "800VA",
  "350VA",
  "180VA",
];


const chokeModels = [
  "42A",
  "30A",
  "22A",
  "16A",
  "12A",
  "10A",
];


const ebaModels = [
  "EBA"
];



function Dashboard() {


  const createRow = (model) => ({

    model,

    // Plant 1
    inPlan:0,
    inReadyAuto:0,
    inReadyManual:0,
    inComplete:0,
    inPending:0,


    // Plant 2
    outPlan:0,
    outReadyAuto:0,
    outReadyManual:0,
    outComplete:0,
    outPending:0

  });



  const [transformer,setTransformer] = useState(
    () => transformerModels.map(createRow)
  );


  const [chokes,setChokes] = useState(
    () => chokeModels.map(createRow)
  );


  const [eba,setEba] = useState(
    () => ebaModels.map(createRow)
  );






  // LOAD PRODUCTION PLAN QTY

  useEffect(()=>{


    const loadPlanQty = async()=>{


      try{


        const response = await API.get("/plans");


        const plans = response.data;



        console.log(
          "PLAN DATA",
          plans
        );



        const updatePlan = (oldData)=>{


          return oldData.map(row=>{


            const plan = plans.find(
              p=>p.model === row.model
            );


            if(plan){


              return {

                ...row,


                // Plant 1 Plan Qty
                inPlan:
                plan.inwardTotalPlan || 0,


                // Plant 2 Plan Qty
                outPlan:
                plan.outwardTotalPlan || 0


              };

            }


            return row;


          });


        };




        setTransformer(prev=>
          updatePlan(prev)
        );



        setChokes(prev=>
          updatePlan(prev)
        );



        setEba(prev=>
          updatePlan(prev)
        );



      }
      catch(error){


        console.log(
          "PLAN LOAD ERROR",
          error
        );


      }


    };



    loadPlanQty();



  },[]);









  const handleChange = (
    section,
    index,
    field,
    value
  )=>{


    const update = (setter)=>{


      setter(prev=>

        prev.map((row,i)=>


          i===index

          ?

          {

            ...row,

            [field]:
            Number(value)

          }


          :

          row


        )

      );


    };





    switch(section){


      case "transformer":

        update(setTransformer);

        break;



      case "chokes":

        update(setChokes);

        break;



      case "eba":

        update(setEba);

        break;



      default:

        break;


    }



  };









  const renderRows = (
    title,
    section,
    data
  )=>


  data.map((row,index)=>(


    <tr key={`${section}-${index}`}>



      {
        index===0 &&

        <td
          rowSpan={data.length}
          className="category-cell"
        >

          <div className="rotate-text">

            {title}

          </div>


        </td>

      }






      <td>
        <b>{row.model}</b>
      </td>





      {/* PLANT 1 */}

      <td>
        {row.inPlan}
      </td>


      <td>
        {row.inReadyAuto}
      </td>



      <td>

        <input

          type="number"

          value={row.inReadyManual}

          onChange={(e)=>

            handleChange(
              section,
              index,
              "inReadyManual",
              e.target.value
            )

          }

        />


      </td>



      <td>
        {row.inComplete}
      </td>


      <td>
        {row.inPending}
      </td>






      {/* PLANT 2 */}


      <td>
        {row.outPlan}
      </td>



      <td>
        {row.outReadyAuto}
      </td>



      <td>

        <input

          type="number"

          value={row.outReadyManual}


          onChange={(e)=>

            handleChange(
              section,
              index,
              "outReadyManual",
              e.target.value
            )

          }


        />


      </td>



      <td>
        {row.outComplete}
      </td>



      <td>
        {row.outPending}
      </td>



    </tr>


  ));









  return (


    <div className="dashboard-page">


      <h2 className="dashboard-title">

        ELMAG PRODUCTION PLANNING DASHBOARD

      </h2>





      <div className="planning-card">


        <div className="planning-container">


          <table className="planning-table">



            <thead>


              <tr>


                <th rowSpan="2">
                  
                </th>



                <th rowSpan="2">

                  Model

                </th>



                <th colSpan="5"
                    className="head-in">

                  Plant 1

                </th>




                <th colSpan="5"
                    className="head-out">

                  Plant 2

                </th>


              </tr>





              <tr>


                <th>
                  Plan Qty
                </th>

                <th>
                  Ready Auto
                </th>

                <th>
                  Ready Manual
                </th>

                <th>
                  Complete
                </th>

                <th>
                  Pending
                </th>




                <th>
                  Plan Qty
                </th>

                <th>
                  Ready Auto
                </th>

                <th>
                  Ready Manual
                </th>

                <th>
                  Complete
                </th>

                <th>
                  Pending
                </th>



              </tr>


            </thead>





            <tbody>


              {renderRows(
                "Transformer",
                "transformer",
                transformer
              )}



              {renderRows(
                "Chokes",
                "chokes",
                chokes
              )}



              {renderRows(
                "EBA",
                "eba",
                eba
              )}


            </tbody>



          </table>



        </div>



      </div>



    </div>


  );


}



export default Dashboard;