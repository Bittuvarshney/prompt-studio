output "instance_public_ip" {
  description = "Public IP of the application instance"
  value       = aws_instance.app.public_ip
}

output "instance_id" {
  description = "Instance ID"
  value       = aws_instance.app.id
}
