import { useEffect, useState } from "react"
import axios from "axios"

function Rankings() {

  const [rankings, setRankings] = useState([])

  useEffect(() => {

    fetchRankings()

  }, [])

  const fetchRankings = async () => {

    const response =
      await axios.get(
        "http://localhost:5000/api/rankings"
      )

    setRankings(response.data)

  }

  return (

    <div className="bg-black min-h-screen text-white p-10">

      <h1 className="text-5xl font-bold text-yellow-400 mb-10">
        Resume Rankings
      </h1>

      {
        rankings.map((item, index) => (

          <div
            key={item._id}
            className="bg-[#111] p-6 rounded-xl mb-4"
          >

            <h2 className="text-2xl font-bold">

              Rank #{index + 1}

            </h2>

            <p>
              Candidate:
              {" "}
              {item.candidateName}
            </p>

            <p>
              ATS Score:
              {" "}
              {item.atsScore}
            </p>

          </div>

        ))
      }

    </div>

  )

}

export default Rankings