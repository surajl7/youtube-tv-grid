export default function LoadingScreen({ status }) {
  return (
    <div className="tv-wrap">
      <div className="tv-frame">
        <div className="screen-bezel">
          <div className="tv-screen login-screen">
            <div className="login-content">
              <div className="loading-bars">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="loading-bar"
                    style={{ animationDelay: `${i * 0.12}s` }}
                  />
                ))}
              </div>
              <div className="login-title" style={{ fontSize: '20px', letterSpacing: '6px' }}>
                TUNING IN
              </div>
              <div className="login-sub loading-status">
                {status || 'PLEASE WAIT...'}
              </div>
            </div>
          </div>
        </div>

        <div className="tv-tray">
          <div className="tv-speaker" />
          <div className="tv-knobs">
            <div className="tv-knob" />
            <div className="tv-knob" />
            <div className="tv-power-led" />
          </div>
        </div>
        <div className="tv-brand">YOUTUBE · TV</div>
      </div>
    </div>
  )
}
