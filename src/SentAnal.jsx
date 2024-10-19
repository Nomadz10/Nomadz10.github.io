import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LinearScale, CategoryScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import './assets/styles/sent.css';
import Header from "./Header";

// Register the necessary components for the line chart
ChartJS.register(LinearScale, CategoryScale, LineElement, PointElement, Title, Tooltip, Legend);

const SentAnal = () => {
    const [graphData, setGraphData] = useState(null);
    const [hoveredPoint, setHoveredPoint] = useState(null); // Store the hovered point information
    const [isHovered, setIsHovered] = useState(false); // Flag to indicate if a point is being hovered over
    const [graphArea, setGraphArea] = useState({ top: 0, bottom: 0, left: 0, right: 0 });

    // Define the specific points for which you want to show the extra info box, larger point size, and custom hover text
    const selectedPoints = [
        { datasetIndex: 0, dataIndex: 1, hoverText: "UT Dallas, Ole Miss, and University of Pittsburgh implement starship delivery robots on campus\nCES 2020 happened that showcased many delivery robots \n" },
        { datasetIndex: 0, dataIndex: 20, hoverText: "Gonzaga introduces food delivery bots\nUT austin announces 5-year study and experiment with bots on campus\n" },
        { datasetIndex: 0, dataIndex: 25, hoverText: "CES 2022 happened where bots were showcased once again\nthe bigger story with more coverage is that Kiwibot (last mile delivery service) received 10 million in funding." },
        { datasetIndex: 1, dataIndex: 4, hoverText: "This peak is observed in April of 2020 and persists through May. This is an important time period since this was the beginning of the Covid-19 Pandemic. The pandemic contributed to many companies starting conversations about Autonomous delivery robot systems that they are currently or planning to implement within many communities. Starship technologies and other manufacturers reported an increase in demand for ADRs. During this time the demand for ADRs was heavily emphasized by companies and the media. This is apparent in the many articles that were published around this time by Forbes, and other reputable tech websites, highlighting the demand increase. " },
        { datasetIndex: 1, dataIndex: 6, hoverText: "his was still in the early stages of the pandemic. This peak was related to Amazon expressing their plans to expand their delivery robots to more cities. They originally started small scale operations in Seattle, WA and Irvine, CA. During this month they expressed interest in expanding to Franklin, TN and Atlanta, GA. The implementation by Amazon of delivery robots was very conservative as initially these robots were accompanied by a human at all times. The robots also only operated during day time on weekdays.\n" },
        { datasetIndex: 1, dataIndex: 15, hoverText: "Domino’s Pizza announced that they would be debuting their first Autonomous delivery robot in Houston. The company which provided them with this technology was NURO. There was heavy marketing in the community surrounding the release. Dominos also stated that the reason they went with NURO is because they were the first fully autonomous delivery vehicle that was approved by the US Department of Transportation. This was the largest peak that was recorded in our time frame. This is likely due to the fact that Dominos, which is a large brand, implemented ADRs in a city with a large population. This was the first-time delivery robots were implemented for the delivery of food on this large of a scale.\n" },
        { datasetIndex: 1, dataIndex: 23, hoverText: "The city of Toronto issued a ban on all SADRs. This is an interesting peak in which the positive sentiment increased along with the number of tweets. Mostly the tweets showed support for the ban and painted the robots as disruptive to pedestrian culture as well as road traffic\"Amazon expressed plans to expand ADRs to more cities, starting small scale operations." },
        { datasetIndex: 1, dataIndex: 26, hoverText: "This is another peak in chatter which prompts a decline in sentiment. In this instance, information was disseminated regarding the news that Yandex, a company that specializes in delivery robots, was found to have Russian ties. This company was affiliated with many universities as well as some notable food delivery services such as Grubhub. As a consequence of the news, Grubhub officially cut ties with the company and universities pulled these robots off of their campuses. Sentiment took a slight dip which is expected" },
        { datasetIndex: 1, dataIndex: 28, hoverText: "This is the third highest peak and occurs in May of 2022. In this instance a large volume of chatter was generated when Uber partnered with Serve Robotics to bring sidewalk delivery robots to Santa Monica and West Hollywood in California.  Uber said the consumers could opt out of the autonomous delivery robot options if they were not comfortable. The news an increase in posts was accompanied by a significant dip in overall sentiment." },
        { datasetIndex: 1, dataIndex: 32, hoverText: "A food delivery robot in Los Angeles, oblivious of its surroundings, rolls through the middle of an active crime scene. It ignores the police tape and other hazards in its way. This incident brought about a large influx of tweets, becoming the second highest in terms of volume. Moreover, this news brought along a significant dip in sentiment, with the lowest score corresponding to this period. Many people expressed concerns about delivery robots not being mindful of surroundings. Critics pointed to this incident as an example of how delivery robots could become disruptive in our daily lives" },
    ];
    const robotImages = [
        'img_1.png',
        'img_2.png',
        'img_3.png',
        'img_4.png',
        'img_5.png',
        'img_6.png'
    ];
    // State to track the current image
    const [visibleImages, setVisibleImages] = useState([]);
    // Function to generate random positions, avoiding the graph area
    const getRandomPosition = () => {
        let top, left;
        do {
            top = Math.random() * 80 + 5; // Random top position between 5% and 85% of the screen
            left = Math.random() * 80 + 5; // Random left position between 5% and 85%
        } while (
            top > graphArea.top && top < graphArea.bottom &&
            left > graphArea.left && left < graphArea.right
            );
        return { top: `${top}%`, left: `${left}%` };
    };

    // Cycle through random images every 8 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            // Randomly choose 2-3 images with random positions
            const numImages = Math.floor(Math.random() * 2) + 2; // Randomly choose between 2 and 3 images
            const randomImages = Array.from({ length: numImages }, () => {
                const randomIndex = Math.floor(Math.random() * robotImages.length);
                return {
                    src: robotImages[randomIndex],
                    position: getRandomPosition()
                };
            });
            setVisibleImages(randomImages);
        }, 8000); // Change images every 8 seconds

        return () => clearInterval(interval);
    }, [robotImages, graphArea]);

    // Set the bounding area of the graph on mount and resize
    useEffect(() => {
        const updateGraphArea = () => {
            const graphElement = document.querySelector('.mgraph-page');
            if (graphElement) {
                const rect = graphElement.getBoundingClientRect();
                setGraphArea({
                    top: (rect.top / window.innerHeight) * 100,
                    bottom: (rect.bottom / window.innerHeight) * 100,
                    left: (rect.left / window.innerWidth) * 100,
                    right: (rect.right / window.innerWidth) * 100,
                });
            }
        };

        updateGraphArea();
        window.addEventListener('resize', updateGraphArea);

        return () => {
            window.removeEventListener('resize', updateGraphArea);
        };
    }, []);

    useEffect(() => {
        fetch('emotions_data.json') // Ensure the file is in the public folder
            .then(response => response.json())
            .then(data => {
                const chartData = {
                    labels: data.map(item => item['Month']),
                    datasets: [
                        {
                            label: 'Sentiment',
                            data: data.map(item => item['Sentiment']),
                            borderColor: 'rgb(17,243,243)',
                            backgroundColor: 'rgb(0,111,255)',
                            yAxisID: 'y-axis-sentiment',
                            borderWidth: 2,
                            pointRadius: data.map((item, index) =>
                                selectedPoints.some(point => point.datasetIndex === 0 && point.dataIndex === index) ? 10 : 3
                            ),
                            pointHoverRadius: data.map((item, index) =>
                                selectedPoints.some(point => point.datasetIndex === 0 && point.dataIndex === index) ? 12 : 4
                            ),
                            pointBackgroundColor: data.map((item, index) =>
                                selectedPoints.some(point => point.datasetIndex === 0 && point.dataIndex === index) ? 'rgba(0,0,0,0)' : 'rgb(0,255,255)'
                            ),
                            pointBorderColor: data.map((item, index) =>
                                selectedPoints.some(point => point.datasetIndex === 0 && point.dataIndex === index) ? 'rgb(255,255,255)' : 'rgb(17,243,243)'
                            ),
                            fill: false,
                        },
                        {
                            label: '#Tweets',
                            data: data.map(item => item['#Tweets']),
                            borderColor: 'rgb(255,13,179)',
                            backgroundColor: 'rgb(85,0,253)',
                            yAxisID: 'y-axis-tweets',
                            borderWidth: 2,
                            pointRadius: data.map((item, index) =>
                                selectedPoints.some(point => point.datasetIndex === 1 && point.dataIndex === index) ? 10 : 3
                            ),
                            pointHoverRadius: data.map((item, index) =>
                                selectedPoints.some(point => point.datasetIndex === 1 && point.dataIndex === index) ? 12 : 4
                            ),
                            pointBackgroundColor: data.map((item, index) =>
                                selectedPoints.some(point => point.datasetIndex === 1 && point.dataIndex === index) ? 'rgba(0,0,0,0)' : 'rgb(255,13,179)'
                            ),
                            pointBorderColor: data.map((item, index) =>
                                selectedPoints.some(point => point.datasetIndex === 1 && point.dataIndex === index) ? 'rgb(255,255,255)' : 'rgb(255,13,179)'
                            ),
                            fill: false,
                        }
                    ],
                };

                setGraphData(chartData);
            })
            .catch(error => console.error('Error fetching the data:', error));
    }, []);

    const handleHover = (event, elements) => {
        if (elements && elements.length > 0) {
            const index = elements[0].index;
            const datasetIndex = elements[0].datasetIndex;

            const selectedPoint = selectedPoints.find(point => point.datasetIndex === datasetIndex && point.dataIndex === index);

            if (selectedPoint) {
                const { clientX, clientY } = event.native; // Capture mouse position

                const cardPosition = calculateCardPosition(clientX, clientY);

                setHoveredPoint({
                    hoverText: selectedPoint.hoverText,
                    label: graphData.labels[index],
                    ...cardPosition,
                });
                setIsHovered(true);
            } else {
                setIsHovered(false);
            }
        } else {
            setIsHovered(false);
        }
    };

    const calculateCardPosition = (x, y) => {
        const buffer = 20;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        let cardX = x + buffer;
        let cardY = y + buffer;

        if (x + 300 > windowWidth) {
            cardX = x - 300 - buffer;
        }
        if (y + 200 > windowHeight) {
            cardY = y - 200 - buffer;
        }

        return { x: cardX, y: cardY };
    };

    return (
        <div>
            <Header />
            <main>

                {/* Cards Section */}
                <div className="gcards-section">
                    <div className="gcard">
                        <h2>Project Introduction</h2>
                        <p>“This is the world now, logged on, plugged in, all the time.” Although a quote from the terminator might seem extreme when discussing delivery robots, it is an accurate description of the world we currently live in. Over the past forty years the internet has brought about many changes in the day to day lives of people. A big change, which has been gaining more and more traction over the past five years, is online shopping. An increasing number of consumers are choosing to shop from the comfort of their homes and offices.</p>
                    </div>
                    <div className="gcard">
                        <h2>Significance</h2>
                        <p>The findings offer insights into public perception of ADRs and how major events, such as COVID-19 and key announcements by tech companies, influenced both sentiment and awareness. The project serves as a valuable tool for understanding the impact of these technologies on society.The past four years have seen a rise in investment and implementations of last mile delivery robots. Companies across the world have been slowly testing automated delivery robot methods in cities and universities</p>
                    </div>
                    <div className="gcard">
                        <h2>Sentiment Graph</h2>
                        <p>Below is an interactive graph where you can hover over points circled in white to learn more about the events that caused certain peaks or valleys in volume of tweets and sentiment score. Below the graph is a more detailed analysis of the project and the insights and learnings we gained from it. The methodology and the process are also detailed below. </p>
                    </div>
                </div>

                <div className="mgraph-page">
                    <h1>Public Opinion on the Use of Autonomous Robots for Last-Mile Deliveries</h1>
                    {graphData ? (
                        <div className="mchart-container">
                            {isHovered && (
                                <div
                                    className="mhover-info"
                                    style={{ top: `${hoveredPoint.y}px`, left: `${hoveredPoint.x}px` }}
                                >
                                    <div className="minfo-box">
                                        <p>{hoveredPoint.label}</p>
                                        <p>{hoveredPoint.hoverText}</p>
                                    </div>
                                    <div className="mdimmed-background"></div>
                                </div>
                            )}
                            <Line
                                data={graphData}
                                options={{
                                    maintainAspectRatio: false,
                                    onHover: handleHover,
                                    scales: {
                                        'y-axis-sentiment': {
                                            type: 'linear',
                                            position: 'left',
                                            beginAtZero: true,
                                            ticks: {
                                                font: {
                                                    size: 14,
                                                    weight: 'bold',
                                                },
                                                color: '#00FFFF',
                                            },
                                            title: {
                                                display: true,
                                                text: 'Sentiment',
                                                font: {
                                                    size: 16,
                                                    weight: 'bold',
                                                },
                                                color: '#00FFFF',
                                            },
                                        },
                                        'y-axis-tweets': {
                                            type: 'linear',
                                            position: 'right',
                                            beginAtZero: true,
                                            ticks: {
                                                font: {
                                                    size: 14,
                                                    weight: 'bold',
                                                },
                                                color: '#FF00FF',
                                            },
                                            title: {
                                                display: true,
                                                text: '#Tweets',
                                                font: {
                                                    size: 16,
                                                    weight: 'bold',
                                                },
                                                color: '#ff00ff',
                                            },
                                        },
                                        'x': {
                                            ticks: {
                                                font: {
                                                    size: 14,
                                                    weight: 'bold',
                                                },
                                                color: '#FFFFFF',
                                            },
                                            title: {
                                                display: true,
                                                text: 'Month',
                                                font: {
                                                    size: 16,
                                                    weight: 'bold',
                                                },
                                                color: '#FFFFFF',
                                            },
                                        },
                                    },
                                    plugins: {
                                        tooltip: {
                                            enabled: true,
                                        },
                                    },
                                }}
                            />
                        </div>
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
                <div className="gcards-section">
                    <div className="gcard">
                        <h2>Methodology and Approach</h2>
                        <p>For this research, Twitter was used as the singular source of data from which sentiment was gathered and analyzed. Twitter was the social media of choice due to the ease of access to data provided through their API. Twitter also provides a unique perspective as it provides a platform for interactions between consumers, brands, and investors in real time. This combined with the ability to measure how each tweet is received by the community through analyzing retweets, likes and mentions gives us important insights about the sentiment in the community regarding autonomous delivery robots.
                            We focused on an extended time frame in order to gather sentiment over multiple years. The reason we chose a larger time frame is because, as seen in this research, individual events can heavily influence the sentiment and the volume of tweets over short periods of time. We felt that choosing any small timeframe would result in less accurate conclusions since these events can heavily influence the data that is being collected. For this research we chose to look at data from a two year and ten month period starting from January 1, 2020 and ending in October 21, 2022. This time period also provides a unique insight on how the beginning of the Covid 19 pandemic impacted the volume of tweets and the sentiment surrounding ADRs.
                            To collect data, three main words were searched: delivery robot, sidewalk robot, and last mile robot. These keywords were selected after reviewing many other research papers in the autonomous delivery robot field. These words provided a broad selection of tweets since they were some of the most common names for Autonomous Delivery Robots (ADRs). The keywords also helped in isolating tweets specifically about robots that were involved in deliveries as opposed to other autonomous vehicles and processes being implemented.
                            The tweets were collected into files separated by day. They were then also separated by keyword for each day. This means that each day had three files consisting of tweets, each file was relevant to one of the keywords. These text files consisted of multiple attributes for each tweet. In our analysis we focused on: author ID, conversation ID, date created, like count, quote count, reply count, retweet count, and the actual text. This information was gathered with the help of json library. Once the data was collected for each tweet, it was appended to a dataframe. This dataframe was then placed in an excel file.  From the text we also gleaned relevant information such as; does the text have a link? Does the text contain any hashtags? And does the text contain any mentions of other users?
                            We also gathered key words from the text which indicated emotion. Since the final goal of this research is to analyze sentiment surrounding delivery robots, using python's NRClex library we gauged the emotion of each tweet. Some of the key emotions that we looked for are: fear, anger, anticipation, trust, surprise, positive, negative, sadness, disgust, and joy. The library also helped gauge the general sentiment of each tweet by analyzing the tweets and producing a number between -1 and 1. This score was important for future visualization and analysis to help determine trends in sentiment as opposed to the number of tweets about the topic.
                            In order to get a better understanding of the reception and weight that each tweet had we also collected user data. This included the number of followers, number of lists, number of tweets, and if they were verified or not for each user.
                        </p>
                    </div>
                    <div className="gcard">
                        <h2>Conclusions</h2>
                        <p>This research aimed to model sentiment surrounding Autonomous Delivery Robots over the past two and half years. COVID-19 accelerated interest and investment in relevant technologies due to an increase in general demand and a need for contactless deliveries. It seems that negative responses were typically more abundant. Especially when major companies announced new projects and implementations of ADRs within large communities. The lack of regulation seems to instill uncertainty within communities. Responses are extremely polarizing as the negative sentiments show concern and uncertainty while the positive sentiments show extreme excitement. A lack of understanding about the technology seems to be what leads to many negative comments.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SentAnal;