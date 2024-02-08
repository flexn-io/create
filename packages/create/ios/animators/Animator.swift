import Foundation

protocol Animator {
    init(view: RCTTVView, args: NSDictionary)
    
    func onFocus(animated: Bool)
    
    func onBlur(animated: Bool)
    
    func addChildView(view: RCTTVView)
}
