import UIKit

@objc(TvRemoteHandler)
class TvRemoteHandler: RCTEventEmitter, UIGestureRecognizerDelegate {
    var timer: Timer?
    var hasListener: Bool = false
    var rootViewController: UIViewController?;
    var gesturesMap = [
        UIPress.PressType.leftArrow.rawValue as NSNumber: "left",
        UIPress.PressType.rightArrow.rawValue as NSNumber: "right",
        UIPress.PressType.upArrow.rawValue as NSNumber: "up",
        UIPress.PressType.downArrow.rawValue as NSNumber: "down",
        UIPress.PressType.select.rawValue as NSNumber: "select",
        UIPress.PressType.menu.rawValue as NSNumber: "menu",
        UIPress.PressType.playPause.rawValue as NSNumber: "playPause",
    ]
    
    override init() {
        super.init()
        rootViewController = getViewController()        
        addGestures()        
    }
    
    override func startObserving() {
      hasListener = true
    }

    override func stopObserving() {
      hasListener = false
    }
    
    func getViewController() -> UIViewController? {
       let keyWindow = UIApplication.shared.windows.filter {$0.isKeyWindow}.first
       if var topController = keyWindow?.rootViewController {
           while let presentedViewController = topController.presentedViewController {
               topController = presentedViewController
           }

           return topController
       }

       return keyWindow?.rootViewController ?? nil
    }
    
    func addGestures() {
        // SWIPE
        let recognizerSwipe = UIPanGestureRecognizer(target: self, action: #selector(swipeGestureAction))
        rootViewController?.view.addGestureRecognizer(recognizerSwipe)
        
        // TAP LEFT
        let recognizerLeft = UILongPressGestureRecognizer(target: self, action: #selector(longPressGestureAction))
        recognizerLeft.minimumPressDuration = 0
        recognizerLeft.allowedPressTypes = [UIPress.PressType.leftArrow.rawValue as NSNumber]
        rootViewController?.view.addGestureRecognizer(recognizerLeft)

        // TAP RIGHT
        let recognizerRight = UILongPressGestureRecognizer(target: self, action: #selector(longPressGestureAction))
        recognizerRight.minimumPressDuration = 0
        recognizerRight.allowedPressTypes = [UIPress.PressType.rightArrow.rawValue as NSNumber]
        rootViewController?.view.addGestureRecognizer(recognizerRight)

        // TAP UP
        let recognizerUp = UILongPressGestureRecognizer(target: self, action: #selector(longPressGestureAction))
        recognizerUp.minimumPressDuration = 0
        recognizerUp.allowedPressTypes = [UIPress.PressType.upArrow.rawValue as NSNumber]
        rootViewController?.view.addGestureRecognizer(recognizerUp)

        // TAP DOWN
        let recognizerDown = UILongPressGestureRecognizer(target: self, action: #selector(longPressGestureAction))
        recognizerDown.minimumPressDuration = 0
        recognizerDown.allowedPressTypes = [UIPress.PressType.downArrow.rawValue as NSNumber]
        rootViewController?.view.addGestureRecognizer(recognizerDown)
        
        // TAP SELECT
        let recognizerSelect = UITapGestureRecognizer(target: self, action: #selector(tapGestureAction))
        recognizerSelect.delegate = self
        recognizerSelect.allowedPressTypes = [UIPress.PressType.select.rawValue as NSNumber]
        rootViewController?.view.addGestureRecognizer(recognizerSelect)

        // TAP MENU
         let recognizerMenu = UITapGestureRecognizer(target: self, action: #selector(tapGestureAction))
        recognizerMenu.delegate = self
        recognizerMenu.allowedPressTypes = [UIPress.PressType.menu.rawValue as NSNumber]
        rootViewController?.view.addGestureRecognizer(recognizerMenu)

       // TAP Play/Pause
        let recognizerPlayPause = UITapGestureRecognizer(target: self, action: #selector(tapGestureAction))
        recognizerPlayPause.delegate = self
        recognizerPlayPause.allowedPressTypes = [UIPress.PressType.playPause.rawValue as NSNumber]
        rootViewController?.view.addGestureRecognizer(recognizerPlayPause)
    }
    
    func gestureRecognizer(_ gestureRecognizer: UIGestureRecognizer, shouldRecognizeSimultaneouslyWith otherGestureRecognizer: UIGestureRecognizer) -> Bool {
        return true
    }

    @objc func swipeGestureAction(gesture: UIPanGestureRecognizer) {
        var direction = ""
        var velocity: CGFloat = 0.0
        let directionEnum = gesture.guessDirection(view: rootViewController!.view)
        if case .Down = directionEnum {
            direction = "swipeDown"
            velocity = gesture.velocity(in: rootViewController?.view).y
        } else if case .Up = directionEnum {
            direction = "swipeUp"
            velocity = gesture.velocity(in: rootViewController?.view).y
        } else if case .Left = directionEnum {
            direction = "swipeLeft"
            velocity = gesture.velocity(in: rootViewController?.view).x
        } else if case .Right = directionEnum {
            direction = "swipeRight"
            velocity = gesture.velocity(in: rootViewController?.view).x
        }
        
        if gesture.state == .began {
            sendAppleTVEvent(eventType: direction, eventKeyAction: "down", velocity: velocity)
        } else if gesture.state == .ended {
            sendAppleTVEvent(eventType: direction, eventKeyAction: "up", velocity: velocity)
        }
    }
    
    @objc func tapGestureAction(gesture: UITapGestureRecognizer) {
        let direction = gesturesMap[gesture.allowedPressTypes[0]]
        
        sendAppleTVEvent(eventType: direction!, eventKeyAction: "down", velocity: 0.0)
    }
        
    @objc func longPressGestureAction(gesture: UITapGestureRecognizer) {
        let direction = gesturesMap[gesture.allowedPressTypes[0]]
        if gesture.state == .began {
            timer?.invalidate()
            sendAppleTVEvent(eventType: direction!, eventKeyAction: "down", velocity: 0.0)
            timer = Timer.scheduledTimer(withTimeInterval: 0.2, repeats: true) { [weak self] timer in
                guard let self = self else {
                    timer.invalidate()
                    return
                }
                self.sendAppleTVEvent(eventType: direction!, eventKeyAction: "down", velocity: 0.0)
            }
            
        } else if gesture.state == .ended || gesture.state == .cancelled {
            timer?.invalidate()
            sendAppleTVEvent(eventType: direction!, eventKeyAction: "up", velocity: 0.0)
        }
    }
    
    @objc func sendAppleTVEvent(eventType: String, eventKeyAction: String, velocity: CGFloat) {
        self.sendEvent(
            withName:"onTVRemoteKey",
            body:[
                "eventType": eventType,
                "eventKeyAction": eventKeyAction,
                "velocity": velocity
            ]
        );
    }
    
    @objc
    override func supportedEvents() -> [String]! {
      return ["onTVRemoteKey"];
    }

    @objc override static func requiresMainQueueSetup() -> Bool {
      return false
    }
}

public enum Direction: Int {
    case Up
    case Down
    case Left
    case Right
}

public extension UIPanGestureRecognizer {
    func guessDirection(view: UIView) -> Direction? {
        let _translation = translation(in: view)
        let vertical = fabs(_translation.y) > fabs(_translation.x)

        if (vertical) {
            if (_translation.y < 0) {
                return .Up
            }
            return .Down
        } else {
            if (_translation.x > 0) {
                return .Right
            }
            return .Left
        }
    }
}
