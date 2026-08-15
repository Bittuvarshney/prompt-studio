terraform {
  backend "s3" {
    bucket = "promptcraft-studio-terraform-state"
    key    = "prod/terraform.tfstate"
    region = "ap-south-1"
  }
}
