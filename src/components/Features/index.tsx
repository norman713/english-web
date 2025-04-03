import "./features.css";

interface FeatureCardProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  content: string;
  iconColor?: string;
  bgColor?: string;
  textColor?: string;
  titleColor?: string;
}

const FeatureCard = ({
  icon: Icon,
  title,
  content,
  iconColor = "text-black",
  bgColor = "bg-white",
  textColor = "text-[#666666]",
  titleColor = "text-[#333333]",
}: FeatureCardProps) => {
  return (
    <div
      className={`p-6 rounded-lg ${bgColor} shadow-lg transition-transform transform hover:translate-y-[-10px] hover:shadow-xl`}
    >
      <div
        className={`flex justify-center items-center text-[10px] ${iconColor}`}
      >
        <Icon width={55} height={55} />
      </div>
      <div className={`mt-4 text-[18px] text ${titleColor}`}>{title}</div>
      <p className={`mt-5 mb-15 ${textColor}`}>{content}</p>
    </div>
  );
};

export default FeatureCard;
