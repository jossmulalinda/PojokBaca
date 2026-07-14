import React from "react";

const IconProject = ({ title, children, href }) => {
  return (
    <a href={href} className="max-w-24 group block cursor-pointer transition-transform duration-200 hover:scale-110">
      <div className="bg-white h-16 w-16 flex justify-center items-center text-good-blue rounded-lg mx-auto shadow-md group-hover:bg-good-blue group-hover:text-white transition-colors duration-250">
        {children}
      </div>
      <p className="hidden md:block text-center text-sm py-2 font-medium dark:text-white group-hover:text-good-blue transition-colors">
        {title}
      </p>
    </a>
  );
};

export default IconProject;
