import React from 'react'


const Transportissue: React.FC = () => {
    return (
        <div style={{ width: '100%', height: '100vh',display:'block'}}>
            <iframe
                src="https://www.utic.go.kr/etc/telMap.do?key=phI0oAv4yuyqD0PdOZEgwjVPss12VCroZYTMFdL0o"
                style={{ width: '100%', height: '100%'}}
                title="TOPIS"
            />
        </div>
    )
}

export default Transportissue