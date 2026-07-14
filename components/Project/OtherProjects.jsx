'use client';

import React, { useEffect, useState } from "react";
import { BASE_API_URL, BASE_API_KEY } from "@/lib/api";
import axios from "axios";
import CardProject from "./CardProject";

const OtherProjects = () => {
  const [projects, setProjects] = useState([]);

  const fetchOtherProjects = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/api/semua-projects`, {
        headers: {
          "P3RT-HMTI-API-KEY": `${BASE_API_KEY}`,
          "Content-Type": "application/json",
        },
      });
      setProjects(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchOtherProjects();
  }, []);

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6 dark:text-white">Project Lainnya</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {projects?.slice(0, 4).map((p, i) => (
          <CardProject
            key={i}
            title={p.judul}
            image={`${BASE_API_URL}/storage/${p.gambar_utama}`}
            category={p.kategori.judul_kategori}
            link={`/projects/${p.kategori.slug}/${p.slug}`}
          />
        ))}
      </div>
    </div>
  );
};

export default OtherProjects;
