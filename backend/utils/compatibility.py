"""
Backward compatibility utilities for maintaining frontend compatibility
while introducing enhanced filtering
"""

def format_legacy_response(filtered_response):
    """
    Convert new filtered response format back to legacy format for 
    existing frontend components that haven't been updated yet
    """
    if isinstance(filtered_response, dict) and 'data' in filtered_response:
        return filtered_response['data']
    return filtered_response

def create_legacy_endpoint_wrapper(service_func):
    """
    Creates a wrapper that maintains legacy response format
    """
    def wrapper(*args, **kwargs):
        result = service_func(*args, **kwargs)
        return format_legacy_response(result)
    return wrapper