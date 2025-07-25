"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import DisciplineBox from "../components/disciplineBox";
import Nav from "../components/nav";
import NotFound from "next/error";
import withAuth from "../../../hoc/withAuth";

type SubjectNames = {
  [branch: string]: {
    [subject: string]: string;
  };
};

function Home() {
  const pathname = usePathname();
  const branches = [
    "/cs",
    "/mac",
    "/ece",
    "/eee",
    "/eni",
    "/ecom",
    "/me",
    "/che",
    "/econ",
    "/math",
    "/phy",
    "/chem",
    "/bio",
    "/bits",
  ];
  const branchTag: { [key: string]: string } = {
    "/cs": "Computer Science Engineering",
    "/mac": "Mathematics and Computer Engineering",
    "/ece": "Electronics and Communication Engineering",
    "/eee": "Electrical and Electronics Engineering",
    "/eni": "Electronics and Instrumentation Engineering",
    "/ecom": "Electronics and Computer Engineering",
    "/me": "Mechanical Engineering",
    "/che": "Chemical Engineering",
    "/econ": "MSc. Economics",
    "/math": "MSc. Mathematics",
    "/phy": "MSc. Physics",
    "/chem": "MSc. Chemistry",
    "/bio": "MSc. Biological Sciences",
    "/bits": "Bits",
  };

  const [subjects, setSubjects] = useState<string[]>([]);
  const [accepted, setAccepted] = useState(false);
  const [subjectNames, setSubjectNames] = useState<SubjectNames>({});
  const [branchName, setBranch] = useState<string>("");

  useEffect(() => {
    const branch = pathname.slice(1); // Remove leading slash
    setBranch(branch);
    if (branches.includes(`/${branch}`)) {
      setAccepted(true);
      fetch("/database.json")
        .then((response) => response.json())
        .then((data) => {
          const branchData = data[branch];
          if (branchData) {
            setSubjects(Object.keys(branchData));
          }
        });
      fetch("/subjectNames.json")
        .then((response) => response.json())
        .then((data) => {
          setSubjectNames(data);
        });
    } else {
      setAccepted(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (!accepted) {
    return <NotFound statusCode={404} />;
  }
  console.log(subjectNames);

  return (
    <div>
      {/* <h1>{pathname.slice(1).toUpperCase()}</h1> */}
      <Nav
        text={`${pathname.slice(1).toUpperCase()} : ${branchTag[pathname]}`}
      />

      {/* <div style={{ position: "absolute", top:"85px" }}> */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {subjects.map((subject, index) => (
          <DisciplineBox
            key={index}
            // text={`${subject.toUpperCase()} : ${subjectNames[branchName.toLowerCase()][subject]}`}
            text={`${subject.toUpperCase()} : ${
              subjectNames[branchName.toLowerCase()]?.[subject]
            }`}
            link={`${pathname}/${subject}`}
            className="draggable"
            style={{ position: "relative", display: "block" }}
          />
        ))}
      </div>
    </div>
  );
}

export default withAuth(Home);
