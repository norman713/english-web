interface StatusTabProps {
  number: number;
  text: string;
  backgroundColor: string;
  numberColor?: string;
}

const StatusTab = ({
  number,
  text,
  backgroundColor,
  numberColor = "text-black",
}: StatusTabProps) => {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-[40px] ${backgroundColor}`}
      style={{ width: "320px", height: "170px" }}
    >
      <div className={`text-[45px] font-bold ${numberColor}`}>{number}</div>
      <div className="text-[35px] text-[#71869D]">{text}</div>
    </div>
  );
};

export default StatusTab;
