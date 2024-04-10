require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name            = "FlexnCreate"
  s.version         = package["version"]
  s.summary         = package["description"]
  s.homepage        = package["homepage"]
  s.license         = package["license"]
  s.authors         = package["author"]

  s.platforms       = { :ios => "10.0", :tvos => "10.0" }
  s.source          = { :git => "https://github.com/flexn-io/create.git", :tag => "#{s.version}" }

  s.tvos.source_files    = "ios/**/*.{h,m,mm,swift}"
  s.swift_version   = '5.0'

  s.dependency "React-Core"
end
