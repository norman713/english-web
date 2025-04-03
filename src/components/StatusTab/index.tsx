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
      style={{ width: "333.33px", height: "185px" }}
    >
      <div className={`text-[50px] font-bold ${numberColor}`}>{number}</div>
      <div className="text-[40px] text-[#71869D]">{text}</div>
    </div>
  );
};

export default StatusTab;
