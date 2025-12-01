export function WhatsAppButton() {
  const whatsappUrl =
    "https://api.whatsapp.com/send?phone=13058139051&text=Hello%2C%20I%20am%20contacting%20you%20through%20your%20website.%20I%20would%20like%20to%20learn%20more%20about%20your%20services%20and%20pricing.%20Thank%20you.";

  return (
    <>
      <style>{`
        @keyframes pulse-button {
          0% {
            box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.7);
          }
          70% {
            box-shadow: 0 0 0 12px rgba(37, 211, 102, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(37, 211, 102, 0);
          }
        }

        @keyframes bounce-button {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes wiggle-button {
          0%, 100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(-3deg);
          }
          75% {
            transform: rotate(3deg);
          }
        }

        .whatsapp-button {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 60px;
          height: 60px;
          background-color: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 999;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          text-decoration: none;
          animation: pulse-button 2.5s infinite, bounce-button 3s ease-in-out infinite;
        }

        .whatsapp-button:hover {
          transform: scale(1.1);
          box-shadow: 0 8px 20px rgba(37, 211, 102, 0.4);
          animation: wiggle-button 0.5s ease-in-out;
        }

        .whatsapp-button:active {
          transform: scale(0.95);
        }

        .whatsapp-icon {
          width: 60px;
          height: 60px;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
        }
      `}</style>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chatea por WhatsApp"
        className="whatsapp-button"
      >
        {/* WhatsApp Icon SVG from public folder */}
        <img
          src="/whatsapp-icon.svg"
          alt="WhatsApp"
          className="whatsapp-icon"
        />
      </a>
    </>
  );
}
