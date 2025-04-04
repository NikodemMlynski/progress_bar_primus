import { useState, useEffect } from "react";
import './App.css';
const formatTime = (seconds: number) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
};
const CountdownTimer = () => {
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [timeLeft, setTimeLeft] = useState(
        -1
    );
    const [isTimeFinished, setIsTimeFinished] = useState(false);

    // Pobieranie zapisanych dat z localStorage19
    useEffect(() => {
        const savedStart = localStorage.getItem("startDate");
        const savedEnd = localStorage.getItem("endDate");
        
        if (savedStart && savedEnd) {
            setStartDate(new Date(savedStart));
            setEndDate(new Date(savedEnd));
        }
    }, []);

    // Obliczanie pozostałego czasu
    useEffect(() => {
        if (!startDate || !endDate) return;
        
        const updateTimer = () => {
            const now = Date.now();
            if(+now > +startDate)
            {
              const remainingTime = Math.max(0, Math.floor((endDate.getTime() - now) / 1000));
              setTimeLeft(remainingTime);
              if(0 > Math.floor((endDate.getTime() - now) / 1000)) {
                setIsTimeFinished(true);
              }
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [startDate, endDate]);

    // Zapisywanie startDate i endDate w localStorage
    const handleStartTimeSubmit = (hours: number, minutes: number) => {
        const newStart = new Date();
        newStart.setHours(hours, minutes, 0, 0);
        setStartDate(newStart);
        localStorage.setItem("startDate", newStart.toISOString());
    };

    const handleEndTimeSubmit = (hours: number, minutes: number) => {
        if (!startDate) return;
        const newEnd = new Date(startDate);
        newEnd.setDate(startDate.getDate()); // + 1
        newEnd.setHours(hours, minutes, 0, 0);
        setEndDate(newEnd);
        localStorage.setItem("endDate", newEnd.toISOString());
    };

    // Formatowanie czasu HH:MM:SS

    const progressPercentage = timeLeft != -1 && startDate && endDate
        ? ((1 - timeLeft / ((endDate.getTime() - startDate.getTime()) / 1000)) * 100).toFixed(2)
        : 0;
    
    const handleResetTime = () => {
        localStorage.removeItem("startDate");
        localStorage.removeItem("endDate");
        setStartDate(null);
        setEndDate(null);
        setIsTimeFinished(false);
        setTimeLeft(-1);
    }

    let timerContent = "Przed transmisją";
    console.log(timeLeft);
    if(isTimeFinished) timerContent = "Koniec primusa";
    if(!isTimeFinished && timeLeft != -1) timerContent = formatTime(timeLeft);
    return (
        <div>
            <div className="timer_container">
                <div className="border">
                <div className="progress_container">
                    <div className="progress_fill" style={{ width: `${progressPercentage}%` }}></div>
                    <div className="progress_text">{timerContent}</div>
                </div>

                </div>
            </div>

            <div className="form_container">
                <StartEndForm onSubmit={handleStartTimeSubmit} onIsFinishedChange={setIsTimeFinished} title="Set Start Time" />
                <StartEndForm onSubmit={handleEndTimeSubmit} onIsFinishedChange={setIsTimeFinished} title="Set End Time" />
            <TimeInfo 
                startDate={startDate}
                endDate={endDate}
                isTimeFinished={isTimeFinished} 
                handleResetTime={handleResetTime}
                />
            </div>
            
        </div>
    );
};


const StartEndForm = ({ onSubmit, title, onIsFinishedChange }: {
     onSubmit: (hours: number, minutes: number) => void,
      title: string,
      onIsFinishedChange: (isTimeFinished: boolean) => void,
    }) => {
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onIsFinishedChange(false);
        onSubmit(hours, minutes);
    };


    return (
        <form onSubmit={handleSubmit} className="time_form">
            <h2>{title}</h2>
            <label>Hours: <input type="number" value={hours} onChange={e => setHours(+e.target.value)} max={23} /></label>
            <label>Minutes: <input type="number" value={minutes} onChange={e => setMinutes(+e.target.value)} max={59} /></label>
            <button type="submit">Set</button>
        </form>
    );
};

const TimeInfo = ({
    handleResetTime, startDate, endDate, isTimeFinished 
}: {
    handleResetTime: () => void,
    startDate: Date | null,
    endDate: Date | null,
    isTimeFinished: boolean
}) => {
    return (
        <div className="time_info">
                <p>Start Date: {startDate && formatTime(+(new Date(startDate)))}</p>
                <p>End Date: {endDate && formatTime(+(new Date(endDate)))}</p>
                <p>Status: {isTimeFinished ? "finished" : "not finished"}</p>
                <button onClick={handleResetTime}>Reset time</button>
            </div>
    )
}

export default CountdownTimer;
