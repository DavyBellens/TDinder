import FileService from "@/services/FileService";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type Props = {
  profiles: any[];
};
const ProfilesOverviewTable: React.FC<Props> = ({ profiles }: Props) => {
  const [images, setImages] = useState<any>();
  const router = useRouter();

  const getImages = async (profiles: any[]) => {
    const images = await Promise.all(
      profiles.map(async (p) =>
        p.pictures.length > 0
          ? await import("../../../back-end/uploads/" + p.pictures[0])
          : await import("../../public/images/default-profilePicture.jpg")
      )
    );
    setImages(images);
  };

  useEffect(() => {
    getImages(profiles);
  }, []);
  return (
    <div className="app m-2">
      {profiles &&
        images &&
        profiles.map((p, index) => {
          return (
            <div
              key={index}
              onClick={() => router.push("/profiles/" + p.id)}
              className="text-md grid grid-cols-4 bg-white bg-opacity-90 pt-1 pb-1 border border-b-1"
            >
              <Image
                alt={"profile picture of profile with id " + p.id}
                className="rounded-full row-span-2 row-start-1 m-auto"
                src={images[index]}
                width={50}
                height={50}
              />
              <div className="grid text-black text-opacity-70 font-bold col-span-3 m-1 grid-rows-2">
                <span className={p.name.length > 15 ? "text-sm" : "text-lg"}>{p.name}</span>
                <div>
                  <span>- {p.age}</span>
                  <span className="font-mono text-xl">
                    {p.gender === "MAN" ? " ♂" : p.gender === "WOMAN" ? " ♀" : ""}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};
export default ProfilesOverviewTable;