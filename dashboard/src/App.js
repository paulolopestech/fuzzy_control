import React, { useEffect, useMemo, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Box } from "@mui/material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
  },
};

const labels = [0];
const grayBG = "#BFBFBF";
const blueBG = "#0E1C36";
const whiteBG = "#FFF";

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    width: "100vw",
    background: grayBG,
  },

  sidebar: {
    width: "20%",
    background: blueBG,
    color: "#FFF",
    p: "1.3rem",
  },

  graphContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    width: "100%",
  },

  graphBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  graphStyle: {
    height: "17rem",
    width: "40rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    mb: "20px",
    p: "0.625rem",
    background: whiteBG,
    margin: "0.625rem auto",
  },

  limitsTitleAlign: {
    textAlign: "left",
  },

  limitsInput: {
    background: "white",
    border: "solid 1px",
    borderColor: "#000",
    width: "50%",
  },

  limitsBox: {
    display: "flex",
    mb: "0.4rem",
  },

  setLimitButton: {
    background: "#eb8334",
    color: "#FFF",
    fontWeight: "bold",
    borderRadius: 0,
    width: "100%",
    mb: "1rem",
    "&:hover": {
      backgroundColor: "#eb995b",
    },
  },

  sendEmailButton: {
    background: "#32a852",
    color: "#FFF",
    "&:hover": {
      backgroundColor: "#5ba36f",
    },
  },
};

const temperatureData = {
  labels,
  datasets: [
    {
      label: "Temperature",
      data: [],
      borderColor: "rgb(13, 0, 255)",
      backgroundColor: "rgba(13, 0, 255, 0.5)",
    },
  ],
};

const errorData = {
  labels,
  datasets: [
    {
      label: "Error",
      data: [],
      borderColor: "rgb(252, 34, 0)",
      backgroundColor: "rgba(252, 34, 0, 0.5)",
    },
  ],
};

function App() {
  const [socket, setSocket] = useState();

  const [temperature, setTemperature] = useState(temperatureData);
  const [erro, setErro] = useState(errorData);

  useMemo(() => {
    setSocket(new WebSocket("ws://localhost:3001"));
  }, []);

  useEffect(() => {
    socket.addEventListener("open", () => {
      console.log("Conexão estabelecida com sucesso.");
    });
    socket.addEventListener("message", (event) => {
      const { topic, message } = JSON.parse(event.data);
      if (topic === "Resfriador/Temperatura") {
        const newData = [...temperature.datasets[0].data, message]
        const labelsLenght = temperature.labels.length
        const newLabels = [...temperature.labels, temperature.labels[labelsLenght - 1] + 1]
        setTemperature({
          labels: newLabels,
          datasets: [{
            ...temperature.datasets[0],
            data: newData,
          }]
        })
      }

      if (topic === "Resfriador/erro") {
        const newData = [...erro.datasets[0].data, message]
        const labelsLenght = erro.labels.length
        const newLabels = [...erro.labels, erro.labels[labelsLenght - 1] + 1]
        setErro({
          labels: newLabels,
          datasets: [{
            ...erro.datasets[0],
            data: newData,
          }]
        })
      }
    });

    socket.addEventListener("close", () => {
      console.log("Conexão fechada.");
      socket.close();
    });
  }, [socket, temperature, erro]);

  return (
    <Box sx={styles.container}>
      <Box sx={styles.graphContainer}>
        <Box sx={styles.graphBox}>
          <Box sx={styles.graphStyle}>
            <Line options={options} data={temperature} />
          </Box>
        </Box>

        <Box sx={styles.graphBox}>
          <Box sx={styles.graphStyle}>
            <Line options={options} data={erro} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default App;
