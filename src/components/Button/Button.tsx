interface ButtonProps {
  text: string;
  bgColor?: string;
  textColor?: string;
  onClick?: () => void;
}
const Button = ({
  text,
  bgColor = "bg-[#F3991B]",
  textColor = "text-white",
  onClick,
}: ButtonProps) => {
  // Hover animation
  const buttonClasses = `${bgColor} ${textColor} text px-6 py-2 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 hover:translate-y-[-2px] transition-all duration-300`;
  return (
    <button className={buttonClasses} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;
