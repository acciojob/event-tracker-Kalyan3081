import React, { useState } from "react";
import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./EventTracker.css";

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [popupType, setPopupType] = useState(null); // 'add' or 'edit'
    const [popupVisible, setPopupVisible] = useState(false);
    const [newEventTitle, setNewEventTitle] = useState("");
    const [filteredEvents, setFilteredEvents] = useState([]);

    const handleSelectSlot = ({ start }) => {
        const formattedDate = moment(start).format("YYYY-MM-DD");
        const eventOnDate = events.find((event) => event.date === formattedDate);
        setSelectedDate({ date: formattedDate, event: eventOnDate || null });
        setPopupType(eventOnDate ? "edit" : "add");
        setPopupVisible(true);
    };

    const handleAddEvent = () => {
        if (newEventTitle.trim()) {
            const newEvents = [...events, { title: newEventTitle.trim(), date: selectedDate.date }];
            setEvents(newEvents);
            setFilteredEvents(newEvents);
            closePopup();
        }
    };

    const handleEditEvent = () => {
        if (newEventTitle.trim()) {
            const updatedEvents = events.map(event =>
                event.date === selectedDate.date
                    ? { ...event, title: newEventTitle.trim() }
                    : event
            );
            setEvents(updatedEvents);
            setFilteredEvents(updatedEvents);
            closePopup();
        }
    };

    const handleDeleteEvent = () => {
        const updatedEvents = events.filter((event) => event.date !== selectedDate.date);
        setEvents(updatedEvents);
        setFilteredEvents(updatedEvents);
        closePopup();
    };

    const closePopup = () => {
        setPopupVisible(false);
        setNewEventTitle("");
    };

    const filterEvents = (filterType) => {
        const now = moment().format("YYYY-MM-DD");
        if (filterType === "all") {
            setFilteredEvents(events);
        } else if (filterType === "past") {
            setFilteredEvents(events.filter((event) => moment(event.date).isBefore(now)));
        } else if (filterType === "upcoming") {
            setFilteredEvents(events.filter((event) => moment(event.date).isAfter(now)));
        }
    };

    const eventStyleGetter = (event) => {
        const eventDate = moment(event.start);
        const now = moment();

        let backgroundColor;
        if (eventDate.isBefore(now, "day")) {
            backgroundColor = "#DE6986"; // Past events
        } else {
            backgroundColor = "#8CBC4C"; // Upcoming events
        }

        return {
            style: { backgroundColor, color: "white" },
        };
    };

    return (
        <div className="calendar-container">
            <Calendar
                localizer={localizer}
                events={filteredEvents.map((e) => ({
                    title: e.title,
                    start: new Date(e.date),
                    end: new Date(e.date),
                    allDay: true,
                }))}
                style={{ height: 500 }}
                selectable
                onSelectSlot={handleSelectSlot}
                defaultView="month"
                eventPropGetter={eventStyleGetter}
            />
            <div className="buttons">
                <button onClick={() => filterEvents("all")}>All</button>
                <button onClick={() => filterEvents("past")}>Past</button>
                <button onClick={() => filterEvents("upcoming")}>Upcoming</button>
            </div>

            {popupVisible && (
                <div className="popup-overlay">
                    <div className="popup-card">
                        {popupType === "add" && (
                            <>
                                <div className="popup-container">
                                    <h3>Add Event</h3>
                                    <input
                                        type="text"
                                        placeholder="Enter event title"
                                        value={newEventTitle}
                                        onChange={(e) => setNewEventTitle(e.target.value)}
                                    />
                                    <div className="popup-buttons">
                                        <button onClick={handleAddEvent}>Add</button>
                                        <button onClick={closePopup}>Cancel</button>
                                    </div>
                                </div>

                            </>
                        )}

                        {popupType === "edit" && (
                            <>
                                <div className="popup-container">
                                    <h3>Edit/Delete Event</h3>
                                    <p>Event: {selectedDate.event.title}</p>
                                    <input
                                        type="text"
                                        placeholder="Edit event title"
                                        value={newEventTitle}
                                        onChange={(e) => setNewEventTitle(e.target.value)}
                                    />
                                    <div className="popup-buttons">
                                        <button onClick={handleEditEvent}>Edit</button>
                                        <button onClick={handleDeleteEvent}>Delete</button>
                                        <button onClick={closePopup}>Cancel</button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )
            }
        </div >
    );
};

export default MyCalendar;
