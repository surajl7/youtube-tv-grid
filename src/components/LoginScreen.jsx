export default function LoginScreen({ onSignIn, loading, error }) {
  return (
    <div className="tv-wrap">
      <div className="tv-frame">
        <div className="screen-bezel">
          <div className="tv-screen login-screen">
            <div className="login-content">
              <div className="login-logo">▣</div>
              <div className="login-title">YOUTUBE · TV</div>
              <div className="login-sub">CONNECT YOUR GOOGLE ACCOUNT</div>
              <div className="login-sub login-sub--dim">
                TO LOAD YOUR SUBSCRIPTIONS
              </div>

              <button
                className="login-btn"
                onClick={onSignIn}
                disabled={loading}
              >
                {loading ? '· · ·' : '▶  SIGN IN WITH GOOGLE'}
              </button>

              {error && (
                <div className="login-error">
                  ▲ {error.toUpperCase()}
                </div>
              )}

              <div className="login-hint">
                A GOOGLE SIGN-IN POPUP WILL APPEAR
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
