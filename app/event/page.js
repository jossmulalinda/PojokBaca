'use client';

import React, { useEffect, useState } from "react";
import AOS from "aos";
import axios from "axios";
import { BASE_API_URL, BASE_API_KEY } from "@/lib/api";
import BounceLoading from "@/components/BounceLoading";
import HeaderStruktur from "@/components/HeaderStruktur";
import { RiCalendarEventLine, RiExternalLinkLine } from "react-icons/ri";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/api/events`, {
        headers: {
          "P3RT-HMTI-API-KEY": `${BASE_API_KEY}`,
          "Content-Type": "application/json",
        },
      });
      setEvents(response.data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-16 px-6 sm:px-10 lg:px-24">
      {/* Header Section */}
      <div className="text-center mb-16" data-aos="fade-down">
        <HeaderStruktur id="events-title" title="HMTI EVENTS" />
        <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg max-w-xl mx-auto mt-4 font-medium leading-relaxed">
          Ikuti berbagai agenda, workshop, kompetisi, dan kegiatan menarik yang diselenggarakan oleh HMTI Unkhair.
        </p>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="py-20">
          <BounceLoading />
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20" data-aos="fade-up">
          <p className="text-gray-500 dark:text-gray-400 text-lg font-semibold">Belum ada event saat ini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div
              key={event.id}
              data-aos="fade-up"
              className="flex flex-col w-full bg-white dark:bg-dark-blue border border-slate-200 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
            >
              {/* Event Image */}
              <div className="relative h-56 w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
                <img
                  src={event.image ? `${BASE_API_URL}/storage/${event.image}` : "/assets/img/marchevent-min.JPG"}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  Agenda
                </div>
              </div>

              {/* Event Details */}
              <div className="p-6 flex flex-col flex-grow">
                {/* Meta (Date) */}
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3 font-medium">
                  <RiCalendarEventLine className="text-blue-500" size={14} />
                  <span>Dibuat: {event.created_at ? new Date(event.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "—"}</span>
                </div>

                {/* Title */}
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-2 leading-snug line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {event.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-gray-600 dark:text-gray-350 line-clamp-3 leading-relaxed mb-6">
                  {event.description || "Mari berpartisipasi dalam agenda menarik HMTI untuk meningkatkan skill, wawasan, dan relasi akademik mahasiswa."}
                </p>

                {/* Button Link */}
                {event.link && (
                  <a
                    href={event.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors py-2 border border-blue-500/20 hover:border-blue-500/50 rounded-xl"
                  >
                    <span>Kunjungi Event</span>
                    <RiExternalLinkLine size={14} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventsPage;
