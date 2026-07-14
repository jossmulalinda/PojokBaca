'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FaAngleRight } from "react-icons/fa";
import axios from "axios";
import { BASE_API_URL, BASE_API_KEY } from "@/lib/api";
import OtherProjects from "@/components/Project/OtherProjects";
import BounceLoading from "@/components/BounceLoading";
import NotFound from "@/components/NotFound";

const DetailProjectPage = () => {
  const { slug, kategori } = useParams();
  const [project, setProject] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProject = async () => {
    if (!slug) return;
    setLoading(true);
    setError(false);
    try {
      const response = await axios.get(
        `${BASE_API_URL}/api/project/${slug}`,
        {
          headers: {
            "P3RT-HMTI-API-KEY": `${BASE_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      const result = response.data;
      setProject(result);

      if (kategori !== result.kategori.slug) {
        setError(true);
      }
    } catch (error) {
      console.error("Error fetching project data:", error);
      setError(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProject();
  }, [slug, kategori]);

  if (loading) {
    return <BounceLoading />;
  }

  if (error || !project) {
    return (
      <NotFound
        msg="Sepertinya project yang anda cari tidak ditemukan."
        btnText="Kembali ke Projects"
        btnLink="/projects"
      />
    );
  }

  return (
    <div className="flex-grow w-full px-3 py-24 lg:px-24">
      <div className="flex gap-1 items-center text-xs md:text-base">
        <Link href="/projects" className="text-good-blue">
          Projects
        </Link>
        <FaAngleRight className="text-gray-400" />
        <span className="text-gray-500 dark:text-gray-300">{project.title}</span>
      </div>

      <div className="my-6">
        <h1 className="text-3xl font-semibold dark:text-white">{project.title}</h1>
        <p className="text-gray-700 dark:text-gray-300 mt-3">{project.description}</p>
      </div>

      {/* Project Details */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="w-full">
          <img
            src={`${BASE_API_URL}/storage/${project.image}`}
            alt={project.title}
            className="object-cover w-full h-80 rounded-xl shadow-lg"
          />
        </div>
        <div className="flex flex-col gap-4 dark:text-white">
          <h3 className="text-xl font-bold">Details:</h3>
          <p>{project.details}</p>
        </div>
      </div>

      {/* Other Projects */}
      <OtherProjects />
    </div>
  );
};

export default DetailProjectPage;
