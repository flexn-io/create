import Foundation

protocol Animator {
    init(view: UIView, args: NSDictionary)
    
    func onFocus(animated: Bool)
    
    func onBlur(animated: Bool)
    
    func addChildView(view: UIView)
}
