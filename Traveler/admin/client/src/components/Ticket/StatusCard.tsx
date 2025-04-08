import React from "react";

const StatusCard: React.FC<{ progress: any, iconClass: any, iconbg: any, title: any, details?: any, progressBg?: any }> = (props) => {
  const { progress, iconClass, iconbg, title, details, progressBg } = props;
  return (
    <div className="card ">
      <div className="card-body">
        <div className="d-flex align-items-center">
          <div className={`avatar lg  rounded-1 no-thumbnail ${iconbg} color-defult`}><i className={iconClass}></i></div>
          <div className="flex-fill ms-4 text-truncate">
            <div className="text-truncate">{title}</div>
            {progress ? <span className={`badge ${progressBg ? progressBg : ""}`}>{progress}</span> : ""}
            {details ? <span className="fw-bold">details</span> : ""}
          </div>

        </div>
      </div>
    </div>
  )
}


export default StatusCard;