terraform {
  backend "s3" {
    bucket = "promptcraft-studio-terraform-state"
    key    = "prod/terraform.tfstate"
    region = "us-east-1"
  }
}
