#if os(tvOS)
@objc(TvFocusableViewManager)
class TvFocusableViewManager: RCTViewManager {

  override func view() -> (TvFocusableView) {
    return TvFocusableView()
  }
    
    @objc func cmdBlur(_ node: NSNumber) -> Void {
        DispatchQueue.main.async {
            let component = self.bridge.uiManager.view(
              forReactTag: node
            ) as! TvFocusableView
            component.blur(animated: true)
        }
    }
    
    @objc func cmdFocus(_ node: NSNumber) -> Void {
        DispatchQueue.main.async {
            let component = self.bridge.uiManager.view(
              forReactTag: node
            ) as! TvFocusableView
            component.focus(animated: true)
        }
    }

    @objc override static func requiresMainQueueSetup() -> Bool {
      return false
    }
}
#endif