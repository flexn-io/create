terraform {
  required_version = "~> 1.2"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.20"
    }
  }
}

variable "userName" {
  type = string
}

provider "aws" {
  region = "eu-central-1"
}

module "aws_lambda" {
  source  = "terraform-aws-modules/lambda/aws"
  version = "3.3.1"

  function_name              = "starter-lambda-function"
  handler                    = "index.handler"
  runtime                    = "nodejs16.x"
  create_lambda_function_url = true
  environment_variables = {
    "USER" = var.userName
  }
  cors = {
    allow_credentials = true
    allow_origins     = ["*"]
    allow_methods     = ["*"]
    allow_headers     = ["*"]
    expose_headers    = ["keep-alive", "date"]
    max_age           = 86400
  }
  source_path = [
    {
      path = path.module,
      patterns = [
        "!.*", // * Exclude everything
        "index.js",
        "node_modules/.+", // * Add all non-empty directories and files in /node_modules/
        "package-lock.json",
        "package.json",
        "utils/.+",
      ]
    },
  ]
}

output "function_url" {
  value = module.aws_lambda.lambda_function_url
}
